"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TherapyEventStore = void 0;
const NormalStringField_1 = __importDefault(require("../../../common/fields/NormalStringField"));
const Guid_1 = __importDefault(require("../../../common/Guid"));
const db_client_1 = require("@eventstore/db-client");
const ConsumptionFrequency_1 = __importDefault(require("../../medicamentConsumption/ConsumptionFrequency"));
const ConsumptionRoute_1 = __importDefault(require("../../medicamentConsumption/ConsumptionRoute"));
const MedicamentConsumption_1 = __importDefault(require("../../medicamentConsumption/MedicamentConsumption"));
const TherapyEvents_1 = require("../TherapyEvents");
const TherapyType_1 = __importDefault(require("../TherapyType"));
class TherapyEventStore {
    eventData(event) {
        if (event instanceof TherapyEvents_1.TherapyCreated)
            return this.therapyCreated.eventData(event);
        if (event instanceof TherapyEvents_1.MedicamentAddedToTherapy)
            return this.medicamentAddedToTherapy.eventData(event);
        if (event instanceof TherapyEvents_1.MedicamentRemovedFromTherapy)
            return this.medicamentRemovedFromTherapy.eventData(event);
        if (event instanceof TherapyEvents_1.TherapyLabelChanged)
            return this.therapyLabelChanged.eventData(event);
        throw new Error();
    }
    event(event) {
        if (event.type === "therapy-created")
            return this.therapyCreated.event(event.data);
        if (event.type === "medicament-added-to-therapy")
            return this.medicamentAddedToTherapy.event(event.data);
        if (event.type === "medicament-removed-from-therapy")
            return this.medicamentRemovedFromTherapy.event(event.data);
        if (event.type === "therapy-label-changed")
            return this.therapyLabelChanged.event(event.data);
        throw new Error();
    }
    get therapyCreated() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "therapy-created", data: {
                    therapyId: event.therapyId.toString(),
                    label: event.label.toString(),
                    type: event.type.toString()
                }
            }),
            event: (data) => new TherapyEvents_1.TherapyCreated(new Guid_1.default(data.therapyId), NormalStringField_1.default.create(data.label), TherapyType_1.default.fromString(data.type))
        };
    }
    get medicamentAddedToTherapy() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "medicament-added-to-therapy",
                data: {
                    therapyId: event.therapyId.toString(),
                    medicamentId: event.medicament.medicamentId.toString(),
                    strength: event.medicament.strength,
                    amount: event.medicament.amount,
                    route: event.medicament.route.toString(),
                    frequency: event.medicament.frequency.toString()
                }
            }),
            event: (data) => new TherapyEvents_1.MedicamentAddedToTherapy(new Guid_1.default(data.therapyId), new MedicamentConsumption_1.default(new Guid_1.default(data.medicamentId), data.strength, data.amount, ConsumptionRoute_1.default.create(data.route), ConsumptionFrequency_1.default.create(data.frequency)))
        };
    }
    get medicamentRemovedFromTherapy() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "medicament-removed-from-therapy",
                data: {
                    therapyId: event.therapyId.toString(),
                    medicamentId: event.medicamentId.toString(),
                }
            }),
            event: (data) => new TherapyEvents_1.MedicamentRemovedFromTherapy(new Guid_1.default(data.therapyId), new Guid_1.default(data.medicamentId))
        };
    }
    get therapyLabelChanged() {
        return {
            eventData: (event) => (0, db_client_1.jsonEvent)({
                type: "therapy-label-changed",
                data: {
                    therapyId: event.therapyId.toString(),
                    label: event.label.toString(),
                }
            }),
            event: (data) => new TherapyEvents_1.TherapyLabelChanged(new Guid_1.default(data.therapyId), NormalStringField_1.default.create(data.label))
        };
    }
}
exports.TherapyEventStore = TherapyEventStore;
