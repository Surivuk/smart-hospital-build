"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalTreatmentEventStore = void 0;
const db_client_1 = require("@eventstore/db-client");
const Guid_1 = __importDefault(require("../../../common/Guid"));
const HospitalTreatmentEvents_1 = require("../HospitalTreatmentEvents");
const NormalStringField_1 = __importDefault(require("../../../common/fields/NormalStringField"));
class HospitalTreatmentEventStore {
    eventData(event) {
        if (event instanceof HospitalTreatmentEvents_1.HospitalTreatmentCreated)
            return this.treatmentCreated.eventData(event);
        if (event instanceof HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment)
            return this.therapyAddedToHospitalTreatment.eventData(event);
        if (event instanceof HospitalTreatmentEvents_1.TherapyRemovedFromHospitalTreatment)
            return this.therapyRemovedFromHospitalTreatment.eventData(event);
        if (event instanceof HospitalTreatmentEvents_1.HospitalTreatmentClosed)
            return this.hospitalTreatmentClosed.eventData(event);
        throw new Error();
    }
    event(event) {
        if (event.type === "hospital-treatment-created")
            return this.treatmentCreated.event(event.data);
        if (event.type === "therapy-added-to-treatment")
            return this.therapyAddedToHospitalTreatment.event(event.data);
        if (event.type === "therapy-removed-from-treatment")
            return this.therapyRemovedFromHospitalTreatment.event(event.data);
        if (event.type === "hospital-treatment-closed")
            return this.hospitalTreatmentClosed.event(event.data);
        throw new Error();
    }
    get treatmentCreated() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "hospital-treatment-created",
                data: {
                    treatmentId: event.treatmentId.toString(),
                    diagnosis: event.diagnosis.toString()
                }
            }),
            event: (data) => new HospitalTreatmentEvents_1.HospitalTreatmentCreated(new Guid_1.default(data.treatmentId), NormalStringField_1.default.create(data.diagnosis))
        };
    }
    get therapyAddedToHospitalTreatment() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "therapy-added-to-treatment",
                data: {
                    treatmentId: event.treatmentId.toString(),
                    therapyId: event.therapyId.toString()
                }
            }),
            event: (data) => new HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment(new Guid_1.default(data.treatmentId), new Guid_1.default(data.therapyId))
        };
    }
    get therapyRemovedFromHospitalTreatment() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "therapy-removed-from-treatment",
                data: {
                    treatmentId: event.treatmentId.toString(),
                    therapyId: event.therapyId.toString()
                }
            }),
            event: (data) => new HospitalTreatmentEvents_1.TherapyRemovedFromHospitalTreatment(new Guid_1.default(data.treatmentId), new Guid_1.default(data.therapyId))
        };
    }
    get hospitalTreatmentClosed() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "hospital-treatment-closed",
                data: {
                    treatmentId: event.treatmentId.toString()
                }
            }),
            event: (data) => new HospitalTreatmentEvents_1.HospitalTreatmentClosed(new Guid_1.default(data.treatmentId))
        };
    }
}
exports.HospitalTreatmentEventStore = HospitalTreatmentEventStore;
