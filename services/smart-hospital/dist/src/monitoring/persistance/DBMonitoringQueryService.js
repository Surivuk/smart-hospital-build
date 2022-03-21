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
exports.DBMonitoringQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBMonitoringQueryServiceError extends Error {
    constructor(message) {
        super(`[DBMonitoringQueryService] Error - ${message}`);
    }
}
exports.DBMonitoringQueryServiceError = DBMonitoringQueryServiceError;
class DBMonitoringQueryService extends KnexConnector_1.default {
    constructor() {
        super(...arguments);
        this._table = "monitoring.monitoring_device";
    }
    monitoringForTreatment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex(this._table).where({ hospital_treatment: id.toString() });
                if (rows.length === 0)
                    throw new Error(`Not found monitoring device for provided treatment. Treatment: "${id.toString()}"`);
                return this.toMonitoring(rows[0]);
            }
            catch (error) {
                throw new DBMonitoringQueryServiceError(`[monitoringForTreatment] - ${error.message}`);
            }
        });
    }
    monitoringList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.knex(this._table)).map(m => this.toMonitoring(m));
            }
            catch (error) {
                throw new DBMonitoringQueryServiceError(`[monitoringList] - ${error.message}`);
            }
        });
    }
    toMonitoring(row) {
        return {
            id: row.id,
            hospitalTreatment: row.hospital_treatment !== null ? row.hospital_treatment : undefined,
            createdAt: row.created_at,
            modifiedAt: row.modified_at !== null ? row.modified_at : undefined,
        };
    }
}
exports.default = DBMonitoringQueryService;
