"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExaminationEventStore = void 0;
const db_client_1 = require("@eventstore/db-client");
const NormalStringField_1 = __importDefault(require("../../../common/fields/NormalStringField"));
const NotEmptyStringField_1 = __importDefault(require("../../../common/fields/NotEmptyStringField"));
const Guid_1 = __importDefault(require("../../../common/Guid"));
const ExaminationEvents_1 = require("../ExaminationEvents");
class ExaminationEventStore {
    eventData(event) {
        if (event instanceof ExaminationEvents_1.ExaminationCreated)
            return this.medicalCardCreated.eventData(event);
        if (event instanceof ExaminationEvents_1.NoteAddedToExamination)
            return this.treatmentNotedToMedicalCard.eventData(event);
        throw new Error();
    }
    event(event) {
        if (event.type === "examination-created")
            return this.medicalCardCreated.event(event.data);
        if (event.type === "note-added-to-examination")
            return this.treatmentNotedToMedicalCard.event(event.data);
        throw new Error();
    }
    get medicalCardCreated() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "examination-created", data: {
                    examinationId: event.examinationId.toString(),
                    doctorId: event.doctorId.toString(),
                    diagnosis: event.diagnose.toString()
                }
            }),
            event: (data) => new ExaminationEvents_1.ExaminationCreated(new Guid_1.default(data.examinationId), new Guid_1.default(data.doctorId), NotEmptyStringField_1.default.create(data.diagnosis, "event-store-diagnoses"))
        };
    }
    get treatmentNotedToMedicalCard() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "note-added-to-examination", data: {
                    examinationId: event.examinationId.toString(),
                    doctorId: event.doctorId.toString(),
                    note: event.note.toString()
                }
            }),
            event: (data) => new ExaminationEvents_1.NoteAddedToExamination(new Guid_1.default(data.doctorId), new Guid_1.default(data.doctorId), NormalStringField_1.default.create(data.note))
        };
    }
}
exports.ExaminationEventStore = ExaminationEventStore;
