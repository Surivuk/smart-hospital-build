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
exports.DBPatientRepositoryError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBPatientRepositoryError extends Error {
    constructor(message) {
        super(`[DBPatientRepository] Error - ${message}`);
    }
}
exports.DBPatientRepositoryError = DBPatientRepositoryError;
class DBPatientQueryService extends KnexConnector_1.default {
    constructor() {
        super(...arguments);
        this._patients = "administration.patient";
    }
    patient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex(this._patients).where({ id: id.toString() });
                if (rows.length === 0)
                    throw new Error(`Not found patient fir provided id. Id: "${id.toString()}"`);
                return this.toPatient(rows[0]);
            }
            catch (error) {
                throw new DBPatientRepositoryError(`[patient] - ${error.message}`);
            }
        });
    }
    patients() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.knex(this._patients)).map(row => this.toPatient(row));
            }
            catch (error) {
                throw new DBPatientRepositoryError(`[patients] - ${error.message}`);
            }
        });
    }
    toPatient(data) {
        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            birthYear: data.birth_year,
            gender: data.gender
        };
    }
}
exports.default = DBPatientQueryService;
