"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TherapyNotedToMedicalCard = exports.ExaminationNotedToMedicalCard = exports.TreatmentNotedToMedicalCard = exports.MedicalCardCreated = void 0;
class MedicalCardCreated {
    constructor(medicalCardId, patientId) {
        this.medicalCardId = medicalCardId;
        this.patientId = patientId;
    }
}
exports.MedicalCardCreated = MedicalCardCreated;
class TreatmentNotedToMedicalCard {
    constructor(medicalCardId, treatmentId) {
        this.medicalCardId = medicalCardId;
        this.treatmentId = treatmentId;
    }
}
exports.TreatmentNotedToMedicalCard = TreatmentNotedToMedicalCard;
class ExaminationNotedToMedicalCard {
    constructor(medicalCardId, examinationId) {
        this.medicalCardId = medicalCardId;
        this.examinationId = examinationId;
    }
}
exports.ExaminationNotedToMedicalCard = ExaminationNotedToMedicalCard;
class TherapyNotedToMedicalCard {
    constructor(medicalCardId, therapyId) {
        this.medicalCardId = medicalCardId;
        this.therapyId = therapyId;
    }
}
exports.TherapyNotedToMedicalCard = TherapyNotedToMedicalCard;
