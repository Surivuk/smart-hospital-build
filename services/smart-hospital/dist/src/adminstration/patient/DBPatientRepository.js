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
class DBPatientRepository extends KnexConnector_1.default {
    createPatient(id, name, gender, birthDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knex("administration.patient").insert({
                    id: id.toString(),
                    first_name: name.firstName,
                    last_name: name.lastName,
                    gender: gender.toString(),
                    birth_year: birthDate.value(),
                    created_at: this.knex.fn.now()
                });
            }
            catch (error) {
                throw new DBPatientRepositoryError(`[createPatient] - ${error.message}`);
            }
        });
    }
}
exports.default = DBPatientRepository;
