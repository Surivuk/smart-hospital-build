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
exports.DBMedicalCardQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../../common/db/KnexConnector"));
class DBMedicalCardQueryServiceError extends Error {
    constructor(message) {
        super(`[DBMedicalCardQueryService] Error - ${message}`);
    }
}
exports.DBMedicalCardQueryServiceError = DBMedicalCardQueryServiceError;
class DBMedicalCardQueryService extends KnexConnector_1.default {
    constructor() {
        super(...arguments);
        this._medicalCard = "medication.medical_card";
        this._notedEvents = "medication.noted_events";
    }
    medicalCard(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex(this._medicalCard).where({ id: id.toString() });
                const notedEventsRows = yield this.knex(this._notedEvents).where({ medical_card: id.toString() });
                if (rows.length === 0)
                    throw new Error(`Not found medicalCard for provided id. Id: "${id.toString()}"`);
                return rows.map(row => this.toMedicalCard(row, notedEventsRows))[0];
            }
            catch (error) {
                throw new DBMedicalCardQueryServiceError(`[medicalCard] - ${error.message}`);
            }
        });
    }
    medicalCards() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex(this._medicalCard);
                const notedEventsRows = yield this.knex(this._notedEvents);
                return rows.map(row => this.toMedicalCard(row, notedEventsRows));
            }
            catch (error) {
                throw new DBMedicalCardQueryServiceError(`[medicalCard] - ${error.message}`);
            }
        });
    }
    toMedicalCard(row, notedEventsRows) {
        const myEvents = notedEventsRows.filter(e => e.medical_card === row.id);
        return {
            id: row.id,
            examinations: myEvents.filter(e => e.type === "EXAMINATION").map(e => ({ examinationId: e.event_id, createdAt: e.created_at })),
            therapies: myEvents.filter(e => e.type === "THERAPY").map(e => ({ therapyId: e.event_id, createdAt: e.created_at })),
            hospitalTreatments: myEvents.filter(e => e.type === "TREATMENT").map(e => ({ treatmentId: e.event_id, createdAt: e.created_at })),
            createdAt: row.created_at
        };
    }
}
exports.default = DBMedicalCardQueryService;
