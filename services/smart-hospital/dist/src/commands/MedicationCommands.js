"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseHospitalTreatment = exports.RemoveTherapyFromTreatment = exports.ChangeTherapyLabel = exports.RemoveMedicamentFromTherapy = exports.AddMedicamentToTherapy = exports.OpenHospitalTreatment = exports.DetermineTherapy = exports.PrescribeTherapy = exports.CreateExamination = void 0;
class CreateExamination {
    constructor(medicalCardId, examinationId, doctorId, diagnose) {
        this.medicalCardId = medicalCardId;
        this.examinationId = examinationId;
        this.doctorId = doctorId;
        this.diagnose = diagnose;
    }
}
exports.CreateExamination = CreateExamination;
class PrescribeTherapy {
    constructor(medicalCardId, therapyId, medicaments) {
        this.medicalCardId = medicalCardId;
        this.therapyId = therapyId;
        this.medicaments = medicaments;
    }
}
exports.PrescribeTherapy = PrescribeTherapy;
class DetermineTherapy {
    constructor(treatmentId, therapyId, treatmentLabel, medicaments) {
        this.treatmentId = treatmentId;
        this.therapyId = therapyId;
        this.treatmentLabel = treatmentLabel;
        this.medicaments = medicaments;
    }
}
exports.DetermineTherapy = DetermineTherapy;
class OpenHospitalTreatment {
    constructor(medicalCardId, treatmentId, diagnosis) {
        this.medicalCardId = medicalCardId;
        this.treatmentId = treatmentId;
        this.diagnosis = diagnosis;
    }
}
exports.OpenHospitalTreatment = OpenHospitalTreatment;
class AddMedicamentToTherapy {
    constructor(therapyId, medicament) {
        this.therapyId = therapyId;
        this.medicament = medicament;
    }
}
exports.AddMedicamentToTherapy = AddMedicamentToTherapy;
class RemoveMedicamentFromTherapy {
    constructor(therapyId, medicamentId) {
        this.therapyId = therapyId;
        this.medicamentId = medicamentId;
    }
}
exports.RemoveMedicamentFromTherapy = RemoveMedicamentFromTherapy;
class ChangeTherapyLabel {
    constructor(therapyId, label) {
        this.therapyId = therapyId;
        this.label = label;
    }
}
exports.ChangeTherapyLabel = ChangeTherapyLabel;
class RemoveTherapyFromTreatment {
    constructor(therapyId, treatmentId) {
        this.therapyId = therapyId;
        this.treatmentId = treatmentId;
    }
}
exports.RemoveTherapyFromTreatment = RemoveTherapyFromTreatment;
class CloseHospitalTreatment {
    constructor(treatmentId) {
        this.treatmentId = treatmentId;
    }
}
exports.CloseHospitalTreatment = CloseHospitalTreatment;
