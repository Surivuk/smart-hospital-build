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
exports.DBHospitalTreatmentQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../../common/db/KnexConnector"));
class DBHospitalTreatmentQueryServiceError extends Error {
    constructor(message) {
        super(`[DBHospitalTreatmentQueryService] Error - ${message}`);
    }
}
exports.DBHospitalTreatmentQueryServiceError = DBHospitalTreatmentQueryServiceError;
class DBHospitalTreatmentQueryService extends KnexConnector_1.default {
    constructor() {
        super(...arguments);
        this._hospitalTreatment = "medication.hospital_treatment";
        this._hospitalTreatmentTherapies = "medication.hospital_treatment_therapies_view";
    }
    treatment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const treatment = yield this.knex(this._hospitalTreatment).where({ id: id.toString() })
                    .leftJoin("medication.noted_events", "medication.hospital_treatment.id", "medication.noted_events.event_id");
                if (treatment.length === 0)
                    throw new Error(`Not found treatment with provided id. Id: "${id.toString()}"`);
                const therapies = yield this.knex(this._hospitalTreatmentTherapies).where({ hospital_treatment: treatment[0].id });
                return this.toTreatmentWithTherapy(treatment[0], therapies);
            }
            catch (error) {
                throw new DBHospitalTreatmentQueryServiceError(`[treatment] - ${error.message}`);
            }
        });
    }
    treatments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex(this._hospitalTreatment)
                    .leftJoin("medication.noted_events", "medication.hospital_treatment.id", "medication.noted_events.event_id");
                return rows.map(treatment => this.toTreatment(treatment));
            }
            catch (error) {
                throw new DBHospitalTreatmentQueryServiceError(`[treatments] - ${error.message}`);
            }
        });
    }
    treatmentsForMedicalCard(medicalCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const treatments = yield this.knex(this._hospitalTreatment)
                    .leftJoin("medication.noted_events", "medication.hospital_treatment.id", "medication.noted_events.event_id")
                    .where({ medical_card: medicalCardId.toString() });
                const therapies = yield this.knex(this._hospitalTreatmentTherapies).whereIn("hospital_treatment", treatments.map(t => t.id));
                return treatments.map(treatment => this.toTreatmentWithTherapy(treatment, therapies.filter(t => t.hospital_treatment === treatment.id)));
            }
            catch (error) {
                throw new DBHospitalTreatmentQueryServiceError(`[treatments] - ${error.message}`);
            }
        });
    }
    toTreatment(data) {
        return {
            id: data.id,
            medicalCard: data.medical_card,
            diagnosis: data.diagnosis,
            closed: data.closed !== null ? data.closed : false,
            createdAt: data.created_at,
            closedAt: data.closed_at !== null ? data.closed_at : undefined
        };
    }
    toTreatmentWithTherapy(data, treatments) {
        return Object.assign(Object.assign({}, this.toTreatment(data)), { therapies: treatments.map(t => ({ therapyId: t.therapy, label: t.label !== null ? t.label : undefined, createdAt: t.created_at })) });
    }
}
exports.default = DBHospitalTreatmentQueryService;
