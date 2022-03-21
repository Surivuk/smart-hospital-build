"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class HealthStorage {
    constructor(_repository, _healthDataFactory) {
        this._repository = _repository;
        this._healthDataFactory = _healthDataFactory;
        this._lastReceivedValue = new Map();
        this._lastSavedTimestamp = 0;
    }
    storeHealthData(treatment, { type, timestamp, value }) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.key(treatment, type);
            const healthData = this._healthDataFactory[type](timestamp, value);
            if (healthData === undefined) {
                console.log(`Not found any health data factory for provided type. Type: "${type}"`);
                return;
            }
            const lastReceivedValue = this._lastReceivedValue.get(key);
            const lastData = lastReceivedValue !== undefined ? this.healthData(type, lastReceivedValue) : undefined;
            const forStoring = this.findDataForStorage(lastData, healthData);
            if (forStoring.length > 0) {
                yield this._repository.save(treatment, forStoring);
                this._lastSavedTimestamp = forStoring[forStoring.length - 1].timestamp();
                this._lastReceivedValue.set(key, { timestamp, value });
            }
        });
    }
    healthData(type, lastReceivedValue) {
        const data = this._healthDataFactory[type](lastReceivedValue.timestamp, lastReceivedValue.value);
        if (data === undefined) {
            throw new Error(`Not found factory for provided data. Key: ${type}`);
        }
        return data;
    }
    findDataForStorage(lastData, newData) {
        const timeDifferenceGraterThen = (lastData, newData, seconds) => newData.timestamp() - lastData.timestamp() >= 1000 * seconds;
        if (lastData === undefined)
            return [newData];
        if (newData.equals(lastData))
            return [];
        if (newData.isInSameCategoryAs(lastData)) {
            if (newData.isNormal() && timeDifferenceGraterThen(lastData, newData, 60))
                return [newData];
            if (newData.isWarning() && timeDifferenceGraterThen(lastData, newData, 30))
                return [newData];
            if (newData.isCritical() && timeDifferenceGraterThen(lastData, newData, 10))
                return [newData];
        }
        else {
            if (this._lastSavedTimestamp === lastData.timestamp())
                return [newData];
            return [lastData, newData];
        }
        return [];
    }
    key(treatment, type) {
        return `${treatment.toString()}_${type}`;
    }
}
exports.default = HealthStorage;
