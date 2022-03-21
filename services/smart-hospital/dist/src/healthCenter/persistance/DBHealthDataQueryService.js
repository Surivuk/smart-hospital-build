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
exports.DBHealthDataQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBHealthDataQueryServiceError extends Error {
    constructor(message) {
        super(`[DBHealthDataQueryService] Error - ${message}`);
    }
}
exports.DBHealthDataQueryServiceError = DBHealthDataQueryServiceError;
class DBHealthDataQueryService extends KnexConnector_1.default {
    healthDataPerDate(treatmentId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.knex.raw(`SELECT 
                hospital_treatment,
                type,
                value, 
                ROUND(EXTRACT (EPOCH FROM timestamp) * 1000) AS timestamp
            FROM health_center.health_data 
            WHERE hospital_treatment = ? AND CAST("timestamp"  AS DATE) = ?
            ORDER BY timestamp ASC`, [treatmentId.toString(), `${this.adapt(date)}%`]);
                return result.rows.map((row) => (Object.assign({}, row)));
            }
            catch (error) {
                throw new DBHealthDataQueryServiceError(`[healthDataPerDate] - ${error.message}`);
            }
        });
    }
    adapt(date) {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`;
        const day = `${date.getDate()}`;
        return `${year}-${month.length === 1 ? `0${month}` : month}-${day.length === 0 ? `0${day}` : day}`;
    }
}
exports.default = DBHealthDataQueryService;
