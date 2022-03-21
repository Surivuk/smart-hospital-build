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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBHealthDataRepositoryError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBHealthDataRepositoryError extends Error {
    constructor(message) {
        super(`[DBHealthDataRepository] Error - ${message}`);
    }
}
exports.DBHealthDataRepositoryError = DBHealthDataRepositoryError;
class DBHealthDataRepository extends KnexConnector_1.default {
    save(treatmentId, healthData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knex("health_center.health_data").insert(healthData.map(data => ({
                    hospital_treatment: treatmentId.toString(),
                    type: data.type().toString(),
                    value: data.value().toString(),
                    timestamp: new Date(data.timestamp()).toISOString()
                })));
            }
            catch (error) {
                throw new DBHealthDataRepositoryError(`[save] - ${error.message}`);
            }
        });
    }
}
exports.default = DBHealthDataRepository;
