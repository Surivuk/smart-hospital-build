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
exports.DBExaminationQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../../common/db/KnexConnector"));
class DBExaminationQueryServiceError extends Error {
    constructor(message) {
        super(`[DBExaminationQueryService] Error - ${message}`);
    }
}
exports.DBExaminationQueryServiceError = DBExaminationQueryServiceError;
class DBExaminationQueryService extends KnexConnector_1.default {
    examination(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex("medication.examination").where({ id: id.toString() });
                if (rows.length === 0)
                    throw new Error(`Not found examination for provided id. Id: "${id}"`);
                return this.toExamination(rows[0]);
            }
            catch (error) {
                throw new DBExaminationQueryServiceError(`[examination] - ${error.message}`);
            }
        });
    }
    toExamination(data) {
        return {
            id: data.id,
            diagnosis: data.diagnosis,
            createdAt: data.created_at
        };
    }
}
exports.default = DBExaminationQueryService;
