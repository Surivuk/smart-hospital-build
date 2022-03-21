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
const AdministrationEvents_1 = require("../events/AdministrationEvents");
const MedicalCard_1 = __importDefault(require("./medicalCard/MedicalCard"));
class MedicationEventHandler {
    constructor(_medicalCardRepository) {
        this._medicalCardRepository = _medicalCardRepository;
    }
    registerHandlers(eventBus) {
        eventBus
            .on(AdministrationEvents_1.PatientAdded.name, ({ patientId }) => __awaiter(this, void 0, void 0, function* () {
            if (yield this.medicalCardExists(patientId)) {
                console.log(`[EVENT BUS] - [MedicationEventHandler] - [PatientAdded] - Provided patient already has medical card. Patient: ${patientId}`);
                return;
            }
            yield this._medicalCardRepository.save(MedicalCard_1.default.create(patientId, patientId));
        }));
    }
    medicalCardExists(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._medicalCardRepository.medicalCard(patientId);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = MedicationEventHandler;
