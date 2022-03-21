"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCardEventStore = void 0;
const db_client_1 = require("@eventstore/db-client");
const Guid_1 = __importDefault(require("../../../common/Guid"));
const MedicalCardEvents_1 = require("../MedicalCardEvents");
class MedicalCardEventStore {
    eventData(event) {
        if (event instanceof MedicalCardEvents_1.MedicalCardCreated)
            return this.medicalCardCreated.eventData(event);
        if (event instanceof MedicalCardEvents_1.TreatmentNotedToMedicalCard)
            return this.treatmentNotedToMedicalCard.eventData(event);
        if (event instanceof MedicalCardEvents_1.ExaminationNotedToMedicalCard)
            return this.examinationNotedToMedicalCard.eventData(event);
        if (event instanceof MedicalCardEvents_1.TherapyNotedToMedicalCard)
            return this.therapyNotedToMedicalCard.eventData(event);
        throw new Error(`[MedicalCardEventStore] - [eventData] - Not found event class`);
    }
    event(event) {
        if (event.type === "medical-card-created")
            return this.medicalCardCreated.event(event.data);
        if (event.type === "treatment-noted-to-medical-card")
            return this.treatmentNotedToMedicalCard.event(event.data);
        if (event.type === "examination-noted-to-medical-card")
            return this.examinationNotedToMedicalCard.event(event.data);
        if (event.type === "therapy-noted-to-medical-card")
            return this.therapyNotedToMedicalCard.event(event.data);
        throw new Error(`[MedicalCardEventStore] - [event] - Not found event type`);
    }
    get medicalCardCreated() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "medical-card-created",
                data: {
                    medicalCardId: event.medicalCardId.toString(),
                    patientId: event.patientId.toString()
                },
            }),
            event: (data) => new MedicalCardEvents_1.MedicalCardCreated(new Guid_1.default(data.medicalCardId), new Guid_1.default(data.patientId))
        };
    }
    get treatmentNotedToMedicalCard() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "treatment-noted-to-medical-card",
                data: {
                    medicalCardId: event.medicalCardId.toString(),
                    treatmentId: event.treatmentId.toString()
                },
            }),
            event: (data) => new MedicalCardEvents_1.TreatmentNotedToMedicalCard(new Guid_1.default(data.medicalCardId), new Guid_1.default(data.treatmentId))
        };
    }
    get examinationNotedToMedicalCard() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "examination-noted-to-medical-card",
                data: {
                    medicalCardId: event.medicalCardId.toString(),
                    examinationId: event.examinationId.toString()
                }
            }),
            event: (data) => new MedicalCardEvents_1.ExaminationNotedToMedicalCard(new Guid_1.default(data.medicalCardId), new Guid_1.default(data.examinationId))
        };
    }
    get therapyNotedToMedicalCard() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "therapy-noted-to-medical-card",
                data: {
                    medicalCardId: event.medicalCardId.toString(),
                    therapyId: event.therapyId.toString()
                }
            }),
            event: (data) => new MedicalCardEvents_1.TherapyNotedToMedicalCard(new Guid_1.default(data.medicalCardId), new Guid_1.default(data.therapyId))
        };
    }
}
exports.MedicalCardEventStore = MedicalCardEventStore;
