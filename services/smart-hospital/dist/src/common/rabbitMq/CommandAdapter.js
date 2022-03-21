"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandAdapterError = void 0;
const NotEmptyStringField_1 = __importDefault(require("../fields/NotEmptyStringField"));
const Guid_1 = __importDefault(require("../Guid"));
const AdministrationCommands_1 = __importDefault(require("../../commands/AdministrationCommands"));
const Name_1 = __importDefault(require("../../adminstration/Name"));
const Gender_1 = __importDefault(require("../../adminstration/Gender"));
const NormalNumberField_1 = __importDefault(require("../fields/NormalNumberField"));
const MedicationCommands_1 = require("../../commands/MedicationCommands");
const MedicamentConsumption_1 = __importDefault(require("../../medication/medicamentConsumption/MedicamentConsumption"));
const ConsumptionRoute_1 = __importDefault(require("../../medication/medicamentConsumption/ConsumptionRoute"));
const ConsumptionFrequency_1 = __importDefault(require("../../medication/medicamentConsumption/ConsumptionFrequency"));
const MonitoringCommands_1 = require("../../commands/MonitoringCommands");
const AlarmingCommands_1 = require("../../commands/AlarmingCommands");
const Alarm_1 = __importDefault(require("../../alarming/alarm/Alarm"));
const AlarmTrigger_1 = __importDefault(require("../../alarming/alarm/AlarmTrigger"));
const TriggerOperation_1 = __importDefault(require("../../alarming/alarm/TriggerOperation"));
const NormalStringField_1 = __importDefault(require("../fields/NormalStringField"));
class CommandAdapterError extends Error {
    constructor(message) {
        super(`[CommandAdapter] Error - ${message}`);
    }
}
exports.CommandAdapterError = CommandAdapterError;
class CommandAdapter {
    constructor() {
        this._serializer = {
            [AdministrationCommands_1.default.name]: ({ patientId, name, gender, birthYear }) => ({
                patientId: patientId.toString(),
                firstName: name.firstName,
                lastName: name.lastName,
                gender: gender.toString(),
                birthYear: birthYear.value()
            }),
            [MedicationCommands_1.CreateExamination.name]: ({ medicalCardId, examinationId, doctorId, diagnose }) => ({
                medicalCardId: medicalCardId.toString(),
                examinationId: examinationId.toString(),
                doctorId: doctorId.toString(),
                diagnose: diagnose.toString()
            }),
            [MedicationCommands_1.PrescribeTherapy.name]: ({ medicalCardId, therapyId, medicaments }) => ({
                medicalCardId: medicalCardId.toString(),
                therapyId: therapyId.toString(),
                medicaments: medicaments.map(({ medicamentId, strength, amount, route, frequency }) => ({
                    medicamentId: medicamentId.toString(),
                    strength: strength.valueOf(),
                    amount: amount.valueOf(),
                    route: route.toString(),
                    frequency: frequency.toString()
                }))
            }),
            [MedicationCommands_1.DetermineTherapy.name]: ({ treatmentId, therapyId, treatmentLabel, medicaments }) => ({
                treatmentId: treatmentId.toString(),
                therapyId: therapyId.toString(),
                therapyLabel: treatmentLabel.toString(),
                medicaments: medicaments.map(({ medicamentId, strength, amount, route, frequency }) => ({
                    medicamentId: medicamentId.toString(),
                    strength: strength.valueOf(),
                    amount: amount.valueOf(),
                    route: route.toString(),
                    frequency: frequency.toString()
                }))
            }),
            [MedicationCommands_1.OpenHospitalTreatment.name]: ({ medicalCardId, treatmentId, diagnosis }) => ({ medicalCardId: medicalCardId.toString(), treatmentId: treatmentId.toString(), diagnosis: diagnosis.toString() }),
            [MonitoringCommands_1.ProcessHealthData.name]: ({ monitoringId, data }) => ({ monitoringId: monitoringId.toString(), data }),
            [AlarmingCommands_1.CreateAlarm.name]: ({ doctorId, alarm }) => (Object.assign({ doctorId: doctorId.toString() }, alarm.dto())),
            [AlarmingCommands_1.ActivateAlarm.name]: ({ alarmId }) => ({ alarmId: alarmId.toString() }),
            [AlarmingCommands_1.DeactivateAlarm.name]: ({ alarmId }) => ({ alarmId: alarmId.toString() }),
            [AlarmingCommands_1.DeleteAlarm.name]: ({ alarmId }) => ({ alarmId: alarmId.toString() }),
            [MedicationCommands_1.AddMedicamentToTherapy.name]: ({ therapyId, medicament }) => ({
                therapyId: therapyId.toString(),
                medicament: {
                    medicamentId: medicament.medicamentId.toString(),
                    strength: medicament.strength.valueOf(),
                    amount: medicament.amount.valueOf(),
                    route: medicament.route.toString(),
                    frequency: medicament.frequency.toString()
                }
            }),
            [MedicationCommands_1.RemoveMedicamentFromTherapy.name]: ({ therapyId, medicamentId }) => ({ therapyId: therapyId.toString(), medicamentId: medicamentId.toString() }),
            [MedicationCommands_1.ChangeTherapyLabel.name]: ({ therapyId, label }) => ({ therapyId: therapyId.toString(), label: label.toString() }),
            [MedicationCommands_1.RemoveTherapyFromTreatment.name]: ({ therapyId, treatmentId }) => ({ therapyId: therapyId.toString(), treatmentId: treatmentId.toString() }),
            [MedicationCommands_1.CloseHospitalTreatment.name]: ({ treatmentId }) => ({ treatmentId: treatmentId.toString() }),
        };
        this._deserializer = {
            [AdministrationCommands_1.default.name]: ({ patientId, firstName, lastName, gender, birthYear }) => new AdministrationCommands_1.default(new Guid_1.default(patientId), Name_1.default.create(firstName, lastName), Gender_1.default.create(gender), NormalNumberField_1.default.create(birthYear)),
            [MedicationCommands_1.CreateExamination.name]: ({ medicalCardId, examinationId, doctorId, diagnose }) => new MedicationCommands_1.CreateExamination(new Guid_1.default(medicalCardId), new Guid_1.default(examinationId), new Guid_1.default(doctorId), NotEmptyStringField_1.default.create(diagnose)),
            [MedicationCommands_1.PrescribeTherapy.name]: ({ medicalCardId, therapyId, medicaments }) => new MedicationCommands_1.PrescribeTherapy(new Guid_1.default(medicalCardId), new Guid_1.default(therapyId), medicaments.map(({ medicamentId, strength, amount, route, frequency }) => new MedicamentConsumption_1.default(new Guid_1.default(medicamentId), strength, amount, ConsumptionRoute_1.default.create(route), ConsumptionFrequency_1.default.create(frequency)))),
            [MedicationCommands_1.DetermineTherapy.name]: ({ treatmentId, therapyId, therapyLabel, medicaments }) => new MedicationCommands_1.DetermineTherapy(new Guid_1.default(treatmentId), new Guid_1.default(therapyId), NotEmptyStringField_1.default.create(therapyLabel), medicaments.map(({ medicamentId, strength, amount, route, frequency }) => new MedicamentConsumption_1.default(new Guid_1.default(medicamentId), strength, amount, ConsumptionRoute_1.default.create(route), ConsumptionFrequency_1.default.create(frequency)))),
            [MedicationCommands_1.OpenHospitalTreatment.name]: ({ medicalCardId, treatmentId, diagnosis }) => new MedicationCommands_1.OpenHospitalTreatment(new Guid_1.default(medicalCardId), new Guid_1.default(treatmentId), new Guid_1.default(diagnosis)),
            [MonitoringCommands_1.ProcessHealthData.name]: ({ monitoringId, data }) => new MonitoringCommands_1.ProcessHealthData(new Guid_1.default(monitoringId), data),
            [AlarmingCommands_1.CreateAlarm.name]: ({ doctorId, treatmentId, id, name, trigger }) => new AlarmingCommands_1.CreateAlarm(Guid_1.default.create(doctorId), new Alarm_1.default(new Guid_1.default(id), Guid_1.default.create(treatmentId), NotEmptyStringField_1.default.create(name), new AlarmTrigger_1.default(NotEmptyStringField_1.default.create(trigger.key), NotEmptyStringField_1.default.create(trigger.value), TriggerOperation_1.default.create(trigger.operator)))),
            [AlarmingCommands_1.ActivateAlarm.name]: ({ alarmId }) => new AlarmingCommands_1.ActivateAlarm(new Guid_1.default(alarmId)),
            [AlarmingCommands_1.DeactivateAlarm.name]: ({ alarmId }) => new AlarmingCommands_1.DeactivateAlarm(new Guid_1.default(alarmId)),
            [AlarmingCommands_1.DeleteAlarm.name]: ({ alarmId }) => new AlarmingCommands_1.DeleteAlarm(new Guid_1.default(alarmId)),
            [MedicationCommands_1.AddMedicamentToTherapy.name]: ({ therapyId, medicament }) => new MedicationCommands_1.AddMedicamentToTherapy(new Guid_1.default(therapyId), new MedicamentConsumption_1.default(new Guid_1.default(medicament.medicamentId), medicament.strength, medicament.amount, ConsumptionRoute_1.default.create(medicament.route), ConsumptionFrequency_1.default.create(medicament.frequency))),
            [MedicationCommands_1.RemoveMedicamentFromTherapy.name]: ({ therapyId, medicamentId }) => new MedicationCommands_1.RemoveMedicamentFromTherapy(new Guid_1.default(therapyId), new Guid_1.default(medicamentId)),
            [MedicationCommands_1.ChangeTherapyLabel.name]: ({ therapyId, label }) => new MedicationCommands_1.ChangeTherapyLabel(new Guid_1.default(therapyId), NormalStringField_1.default.create(label)),
            [MedicationCommands_1.RemoveTherapyFromTreatment.name]: ({ therapyId, treatmentId }) => new MedicationCommands_1.RemoveTherapyFromTreatment(new Guid_1.default(therapyId), new Guid_1.default(treatmentId)),
            [MedicationCommands_1.CloseHospitalTreatment.name]: ({ treatmentId }) => new MedicationCommands_1.CloseHospitalTreatment(new Guid_1.default(treatmentId)),
        };
    }
    serialize(command) {
        const serializer = this._serializer[command.constructor.name];
        if (serializer === undefined)
            throw new CommandAdapterError(`Not found serializer for provided command. Command name: "${command.constructor.name}"`);
        return serializer(command);
    }
    deserialize(commandName, data) {
        const deserializer = this._deserializer[commandName];
        if (deserializer === undefined)
            throw new CommandAdapterError(`Not found deserializer for provided data. Command name: "${commandName}"`);
        return deserializer(data);
    }
}
exports.default = CommandAdapter;
