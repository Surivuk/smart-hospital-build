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
class MemoryAlarmRepository {
    constructor(_repo) {
        this._repo = _repo;
        this._cache = new Map();
    }
    createAlarm(doctorId, alarm) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._repo.createAlarm(doctorId, alarm);
            this.addAlarm(alarm);
        });
    }
    deleteAlarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._repo.deleteAlarm(id);
            this.removeAlarm(id);
        });
    }
    activateAlarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._repo.activateAlarm(id);
            this.addAlarm(yield this._repo.alarm(id));
        });
    }
    deactivateAlarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._repo.deactivateAlarm(id);
            this.removeAlarm(id);
        });
    }
    alarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repo.alarm(id);
        });
    }
    activeAlarms(treatmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._cache.size === 0) {
                const alarms = yield this._repo.activeAlarms(treatmentId);
                this._cache.clear();
                this._cache.set(treatmentId.toString(), alarms);
            }
            const alarms = this._cache.get(treatmentId.toString());
            if (alarms === undefined)
                return [];
            else
                return Array.from(alarms);
        });
    }
    addAlarm(alarm) {
        const { treatmentId } = alarm.dto();
        if (this._cache.get(treatmentId)) {
            const alarms = this._cache.get(treatmentId);
            alarms.push(alarm);
            this._cache.set(treatmentId, alarms);
        }
        else
            this._cache.set(treatmentId, [alarm]);
    }
    removeAlarm(id) {
        this._cache.forEach((alarms) => {
            const index = alarms.findIndex(alarm => alarm.id.equals(id));
            if (index !== -1)
                alarms.splice(index, 1);
        });
    }
}
exports.default = MemoryAlarmRepository;
