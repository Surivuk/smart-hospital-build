"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveMedicationFromTherapy = exports.AddMedicationToTherapy = exports.CreateTherapy = void 0;
class CreateTherapy {
    constructor(therapyId, medications) {
        this.therapyId = therapyId;
        this.medications = medications;
    }
}
exports.CreateTherapy = CreateTherapy;
class AddMedicationToTherapy {
    constructor(therapyId, medication) {
        this.therapyId = therapyId;
        this.medication = medication;
    }
}
exports.AddMedicationToTherapy = AddMedicationToTherapy;
class RemoveMedicationFromTherapy {
    constructor(therapyId, medicationId) {
        this.therapyId = therapyId;
        this.medicationId = medicationId;
    }
}
exports.RemoveMedicationFromTherapy = RemoveMedicationFromTherapy;
