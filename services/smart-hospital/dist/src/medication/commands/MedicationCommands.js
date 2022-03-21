"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTherapyToTreatment = exports.CreateHospitalTreatment = void 0;
class CreateHospitalTreatment {
    constructor(medicalCardId, doctorId) {
        this.medicalCardId = medicalCardId;
        this.doctorId = doctorId;
    }
}
exports.CreateHospitalTreatment = CreateHospitalTreatment;
class AddTherapyToTreatment {
    constructor(treatmentId, therapyId) {
        this.treatmentId = treatmentId;
        this.therapyId = therapyId;
    }
}
exports.AddTherapyToTreatment = AddTherapyToTreatment;
