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
exports.DBTherapyQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../../common/db/KnexConnector"));
class DBTherapyQueryServiceError extends Error {
    constructor(message) {
        super(`[DBTherapyQueryService] Error - ${message}`);
    }
}
exports.DBTherapyQueryServiceError = DBTherapyQueryServiceError;
class DBTherapyQueryService extends KnexConnector_1.default {
    constructor() {
        super(...arguments);
        this._therapy = "medication.therapy";
        this._therapyMedicaments = "medication.therapy_medicaments";
        this._hospitalTreatmentTherapies = "medication.hospital_treatment_therapies";
    }
    therapy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const therapy = yield this.knex(this._therapy).where({ id: id.toString() });
                if (therapy.length === 0)
                    throw new Error(`Not found therapy for provided id. Id: "${therapy.toString()}"`);
                const medicaments = yield this.knex(this._therapyMedicaments).where({ therapy: id.toString() });
                return this.toTherapy(therapy[0], medicaments);
            }
            catch (error) {
                throw new DBTherapyQueryServiceError(`[therapy] - ${error.message}`);
            }
        });
    }
    therapies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const therapies = yield this.knex(this._therapy);
                const medicaments = yield this.knex(this._therapyMedicaments).whereIn("therapy", therapies.map(t => t.id));
                return therapies.map(therapy => this.toTherapy(therapy, medicaments.filter(m => m.therapy === therapy.id)));
            }
            catch (error) {
                throw new DBTherapyQueryServiceError(`[therapies] - ${error.message}`);
            }
        });
    }
    therapiesForTreatmentUntil(treatmentId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const therapies = yield this.knex(this._hospitalTreatmentTherapies).where({ hospital_treatment: treatmentId.toString() });
                const medicaments = yield this.knex(this._therapyMedicaments)
                    .whereIn("therapy", therapies.map(t => t.therapy))
                    .whereRaw(`created_at < ?`, [date.toISOString()]);
                return medicaments.map((row) => this.toMedicament(row));
            }
            catch (error) {
                throw new DBTherapyQueryServiceError(`[therapiesForTreatmentUntil] - ${error.message}`);
            }
        });
    }
    toMedicament(data) {
        return {
            medicamentId: data.medicament_id,
            name: data.medicament_name,
            strength: data.strength,
            amount: data.amount,
            route: data.route,
            frequency: data.frequency,
            createdAt: data.created_at
        };
    }
    toTherapy(data, medications) {
        return {
            id: data.id,
            label: data.label !== null ? data.label : "",
            type: data.type,
            medicaments: medications.map(medicament => this.toMedicament(medicament))
        };
    }
}
exports.default = DBTherapyQueryService;
