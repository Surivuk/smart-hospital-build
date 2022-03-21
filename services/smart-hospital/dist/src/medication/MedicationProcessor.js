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
const MedicationCommands_1 = require("../commands/MedicationCommands");
const NormalStringField_1 = __importDefault(require("../common/fields/NormalStringField"));
const MedicationEvents_1 = require("../events/MedicationEvents");
const Examination_1 = __importDefault(require("./examination/Examination"));
const HospitalTreatment_1 = __importDefault(require("./hospitalTreatment/HospitalTreatment"));
const Therapy_1 = __importDefault(require("./therapy/Therapy"));
class MedicationProcessor {
    constructor(_medicalCardRepository, _examinationRepository, _therapyRepository, _treatmentRepository, _eventBus) {
        this._medicalCardRepository = _medicalCardRepository;
        this._examinationRepository = _examinationRepository;
        this._therapyRepository = _therapyRepository;
        this._treatmentRepository = _treatmentRepository;
        this._eventBus = _eventBus;
    }
    registerProcesses(commandChain) {
        commandChain
            .registerProcessor(MedicationCommands_1.CreateExamination.name, ({ medicalCardId, examinationId, diagnose, doctorId }) => __awaiter(this, void 0, void 0, function* () {
            const medicalCard = yield this._medicalCardRepository.medicalCard(medicalCardId);
            yield this._examinationRepository.save(Examination_1.default.create(examinationId, doctorId, diagnose));
            medicalCard.noteExamination(examinationId);
            yield this._medicalCardRepository.save(medicalCard);
        }))
            .registerProcessor(MedicationCommands_1.PrescribeTherapy.name, ({ medicalCardId, therapyId, medicaments }) => __awaiter(this, void 0, void 0, function* () {
            const medicalCard = yield this._medicalCardRepository.medicalCard(medicalCardId);
            const therapy = Therapy_1.default.createStaticTherapy(therapyId, NormalStringField_1.default.create(""));
            therapy.addMedicaments(medicaments);
            yield this._therapyRepository.save(therapy);
            medicalCard.noteTherapy(therapyId);
            yield this._medicalCardRepository.save(medicalCard);
        }))
            .registerProcessor(MedicationCommands_1.OpenHospitalTreatment.name, ({ medicalCardId, treatmentId, diagnosis }) => __awaiter(this, void 0, void 0, function* () {
            const medicalCard = yield this._medicalCardRepository.medicalCard(medicalCardId);
            yield this._treatmentRepository.save(HospitalTreatment_1.default.create(treatmentId, diagnosis));
            medicalCard.noteHospitalTreatment(treatmentId);
            yield this._medicalCardRepository.save(medicalCard);
            this._eventBus.emit(new MedicationEvents_1.HospitalTreatmentOpened(treatmentId));
        }))
            .registerProcessor(MedicationCommands_1.DetermineTherapy.name, ({ treatmentId, therapyId, treatmentLabel, medicaments }) => __awaiter(this, void 0, void 0, function* () {
            const treatment = yield this._treatmentRepository.treatment(treatmentId);
            const therapy = Therapy_1.default.createDynamicTherapy(therapyId, treatmentLabel);
            therapy.addMedicaments(medicaments);
            yield this._therapyRepository.save(therapy);
            treatment.addTherapy(therapyId);
            yield this._treatmentRepository.save(treatment);
        }))
            .registerProcessor(MedicationCommands_1.AddMedicamentToTherapy.name, ({ therapyId, medicament }) => __awaiter(this, void 0, void 0, function* () {
            const therapy = yield this._therapyRepository.therapy(therapyId);
            therapy.addMedicament(medicament);
            yield this._therapyRepository.save(therapy);
        }))
            .registerProcessor(MedicationCommands_1.RemoveMedicamentFromTherapy.name, ({ therapyId, medicamentId }) => __awaiter(this, void 0, void 0, function* () {
            const therapy = yield this._therapyRepository.therapy(therapyId);
            therapy.removeMedicament(medicamentId);
            yield this._therapyRepository.save(therapy);
        }))
            .registerProcessor(MedicationCommands_1.ChangeTherapyLabel.name, ({ therapyId, label }) => __awaiter(this, void 0, void 0, function* () {
            const therapy = yield this._therapyRepository.therapy(therapyId);
            therapy.changeLabel(label);
            yield this._therapyRepository.save(therapy);
        }))
            .registerProcessor(MedicationCommands_1.RemoveTherapyFromTreatment.name, ({ therapyId, treatmentId }) => __awaiter(this, void 0, void 0, function* () {
            const treatment = yield this._treatmentRepository.treatment(treatmentId);
            treatment.removeTherapy(therapyId);
            yield this._treatmentRepository.save(treatment);
        }))
            .registerProcessor(MedicationCommands_1.CloseHospitalTreatment.name, ({ treatmentId }) => __awaiter(this, void 0, void 0, function* () {
            const treatment = yield this._treatmentRepository.treatment(treatmentId);
            treatment.closeTreatment();
            yield this._treatmentRepository.save(treatment);
            this._eventBus.emit(new MedicationEvents_1.HospitalTreatmentClosed(treatmentId));
        }));
    }
}
exports.default = MedicationProcessor;
