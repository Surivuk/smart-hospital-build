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
exports.DBDoctorQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBDoctorQueryServiceError extends Error {
    constructor(message) {
        super(`[DBDoctorQueryService] Error - ${message}`);
    }
}
exports.DBDoctorQueryServiceError = DBDoctorQueryServiceError;
class DBDoctorQueryService extends KnexConnector_1.default {
    doctors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.knex("administration.doctor")).map(d => this.toDoctor(d));
            }
            catch (error) {
                throw new DBDoctorQueryServiceError(`[doctors] - ${error.message}`);
            }
        });
    }
    toDoctor(row) {
        return {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            gender: row.gender,
            createdAt: row.created_at
        };
    }
}
exports.default = DBDoctorQueryService;
