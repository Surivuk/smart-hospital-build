"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AggregateRootTestFixture_1 = require("../../../common/AggregateRootTestFixture");
const NotEmptyStringField_1 = __importDefault(require("../../../common/fields/NotEmptyStringField"));
const Guid_1 = __importDefault(require("../../../common/Guid"));
const HospitalTreatment_1 = __importStar(require("../../../medication/hospitalTreatment/HospitalTreatment"));
const HospitalTreatmentEvents_1 = require("../../../medication/hospitalTreatment/HospitalTreatmentEvents");
const MEDICATION_CARD_ID = new Guid_1.default("aaa-ff-5-98-12358");
const DOCTOR_ID = new Guid_1.default("dock-111258");
const DIAGNOSIS = NotEmptyStringField_1.default.create("Test");
const HOSPITAL_TREATMENT_ID = new Guid_1.default("12314-456465-54564");
function loadedTreatment() {
    const treatment = new HospitalTreatment_1.default();
    treatment.loadsFromHistory([new HospitalTreatmentEvents_1.HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, DIAGNOSIS)]);
    return treatment;
}
describe('When hospital treatment created', () => {
    let treatment;
    beforeAll(() => {
        treatment = HospitalTreatment_1.default.create(HOSPITAL_TREATMENT_ID, DIAGNOSIS);
    });
    test('should have only one uncommitted event', () => {
        expect(treatment.uncommittedChanges().length).toBe(1);
    });
    test('should have HospitalTreatmentCreated event', () => {
        expect(treatment.uncommittedChanges()[0]).toBeInstanceOf(HospitalTreatmentEvents_1.HospitalTreatmentCreated);
    });
    test('should have same ID as provided ID in constructor', () => {
        expect(treatment.id.equals(HOSPITAL_TREATMENT_ID)).toBe(true);
    });
});
describe('When the treatment added new therapy', () => {
    let result;
    beforeAll(() => {
        result = (0, AggregateRootTestFixture_1.aggregateRootTestFixture)({
            root: () => new HospitalTreatment_1.default(),
            given: () => [new HospitalTreatmentEvents_1.HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, DIAGNOSIS)],
            when: (root) => {
                root.addTherapy(new Guid_1.default("therapy-123"));
            }
        });
    });
    test('should have TherapyAddedToHospitalTreatment event', () => {
        expect(result.events[0]).toBeInstanceOf(HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment);
    });
});
describe('When the treatment added therapy that already added', () => {
    let result;
    beforeAll(() => {
        result = (0, AggregateRootTestFixture_1.aggregateRootTestFixture)({
            root: () => new HospitalTreatment_1.default(),
            given: () => [new HospitalTreatmentEvents_1.HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, DIAGNOSIS)],
            when: (root) => {
                root.addTherapy(new Guid_1.default("therapy-123"));
                root.addTherapy(new Guid_1.default("therapy-123"));
            }
        });
    });
    test('should throw an error', () => {
        expect(result.error).toBeDefined();
    });
    test('should throw HospitalTreatmentError', () => {
        expect(result.error).toBeInstanceOf(HospitalTreatment_1.HospitalTreatmentError);
    });
});
describe('When the therapy removed from treatment', () => {
    let result;
    beforeAll(() => {
        result = (0, AggregateRootTestFixture_1.aggregateRootTestFixture)({
            root: () => new HospitalTreatment_1.default(),
            given: () => [new HospitalTreatmentEvents_1.HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, DIAGNOSIS)],
            when: (root) => {
                root.removeTherapy(new Guid_1.default("therapy-123"));
            }
        });
    });
    test('should throw an error', () => {
        expect(result.error).toBeDefined();
    });
});
describe('When the therapy removed from treatment that do no have any therapy', () => {
    let result;
    beforeAll(() => {
        result = (0, AggregateRootTestFixture_1.aggregateRootTestFixture)({
            root: () => new HospitalTreatment_1.default(),
            given: () => [new HospitalTreatmentEvents_1.HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, DIAGNOSIS)],
            when: (root) => {
                root.removeTherapy(new Guid_1.default("therapy-123"));
            }
        });
    });
    test('should throw an error', () => {
        expect(result.error).toBeDefined();
    });
});
describe('When the therapy removed from treatment', () => {
    let result;
    beforeAll(() => {
        result = (0, AggregateRootTestFixture_1.aggregateRootTestFixture)({
            root: () => new HospitalTreatment_1.default(),
            given: () => [
                new HospitalTreatmentEvents_1.HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, DIAGNOSIS),
                new HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment(HOSPITAL_TREATMENT_ID, new Guid_1.default("therapy-123"))
            ],
            when: (root) => {
                root.removeTherapy(new Guid_1.default("therapy-123"));
            }
        });
    });
    test('should therapy be removed', () => {
        expect(result.events[0].therapyId).toMatchObject(new Guid_1.default("therapy-123"));
    });
});
describe('When the therapy added after removing it from treatment', () => {
    let result;
    beforeAll(() => {
        result = (0, AggregateRootTestFixture_1.aggregateRootTestFixture)({
            root: () => new HospitalTreatment_1.default(),
            given: () => [
                new HospitalTreatmentEvents_1.HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, DIAGNOSIS),
                new HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment(HOSPITAL_TREATMENT_ID, new Guid_1.default("therapy-123"))
            ],
            when: (root) => {
                root.removeTherapy(new Guid_1.default("therapy-123"));
                root.addTherapy(new Guid_1.default("therapy-123"));
            }
        });
    });
    test('should not throw and error', () => {
        expect(result.error).toBeUndefined();
    });
    test('should publish two events', () => {
        expect(result.events[0]).toBeInstanceOf(HospitalTreatmentEvents_1.TherapyRemovedFromHospitalTreatment);
        expect(result.events[1]).toBeInstanceOf(HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment);
    });
});
