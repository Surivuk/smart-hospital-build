"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEventAdapterError = void 0;
const MonitoringEvents_1 = require("../../events/MonitoringEvents");
const Guid_1 = __importDefault(require("../Guid"));
const AdministrationEvents_1 = require("../../events/AdministrationEvents");
const MedicationEvents_1 = require("../../events/MedicationEvents");
const AlarmingEvents_1 = require("../../events/AlarmingEvents");
class DomainEventAdapterError extends Error {
    constructor(message) {
        super(`[DomainEventAdapter] Error - ${message}`);
    }
}
exports.DomainEventAdapterError = DomainEventAdapterError;
class DomainEventAdapters {
    constructor() {
        this._jsonAdapters = {
            [AdministrationEvents_1.PatientAdded.name]: ({ patientId }) => ({ patientId: patientId.toString() }),
            [MedicationEvents_1.HospitalTreatmentOpened.name]: ({ treatmentId }) => ({ treatmentId: treatmentId.toString() }),
            [MonitoringEvents_1.HealthDataReceived.name]: ({ treatmentId, healthData }) => (Object.assign({ treatmentId: treatmentId.toString() }, healthData)),
            [AlarmingEvents_1.AlarmTriggered.name]: ({ treatmentId, alarmId, healthData }) => (Object.assign({ treatmentId: treatmentId.toString(), alarmId: alarmId.toString() }, healthData)),
            [MedicationEvents_1.HospitalTreatmentClosed.name]: ({ treatmentId }) => ({ treatmentId: treatmentId.toString() }),
        };
        this._eventAdapters = {
            [AdministrationEvents_1.PatientAdded.name]: ({ patientId }) => new AdministrationEvents_1.PatientAdded(new Guid_1.default(patientId)),
            [MedicationEvents_1.HospitalTreatmentOpened.name]: ({ treatmentId }) => new MedicationEvents_1.HospitalTreatmentOpened(new Guid_1.default(treatmentId)),
            [MonitoringEvents_1.HealthDataReceived.name]: ({ treatmentId, type, timestamp, value }) => new MonitoringEvents_1.HealthDataReceived(new Guid_1.default(treatmentId), { type, timestamp, value }),
            [AlarmingEvents_1.AlarmTriggered.name]: ({ treatmentId, alarmId, type, timestamp, value }) => new AlarmingEvents_1.AlarmTriggered(new Guid_1.default(treatmentId), new Guid_1.default(alarmId), { type, timestamp, value }),
            [MedicationEvents_1.HospitalTreatmentClosed.name]: ({ treatmentId }) => new MedicationEvents_1.HospitalTreatmentClosed(new Guid_1.default(treatmentId)),
        };
    }
    toJSON(event) {
        const adapter = this._jsonAdapters[event.constructor.name];
        if (adapter === undefined)
            throw new DomainEventAdapterError(`Not found json adapter for provided event. Event: "${event.constructor.name}"`);
        return adapter(event);
    }
    toEvent(topic, data) {
        const adapter = this._eventAdapters[topic];
        if (adapter === undefined)
            throw new DomainEventAdapterError(`Not found event adapter for provided data. Topic: "${topic}"`);
        return adapter(data);
    }
}
exports.default = DomainEventAdapters;
