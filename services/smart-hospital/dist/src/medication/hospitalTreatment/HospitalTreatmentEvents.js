"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalTreatmentClosed = exports.TherapyRemovedFromHospitalTreatment = exports.TherapyAddedToHospitalTreatment = exports.HospitalTreatmentCreated = void 0;
class HospitalTreatmentCreated {
    constructor(treatmentId, diagnosis) {
        this.treatmentId = treatmentId;
        this.diagnosis = diagnosis;
    }
}
exports.HospitalTreatmentCreated = HospitalTreatmentCreated;
class TherapyAddedToHospitalTreatment {
    constructor(treatmentId, therapyId) {
        this.treatmentId = treatmentId;
        this.therapyId = therapyId;
    }
}
exports.TherapyAddedToHospitalTreatment = TherapyAddedToHospitalTreatment;
class TherapyRemovedFromHospitalTreatment {
    constructor(treatmentId, therapyId) {
        this.treatmentId = treatmentId;
        this.therapyId = therapyId;
    }
}
exports.TherapyRemovedFromHospitalTreatment = TherapyRemovedFromHospitalTreatment;
class HospitalTreatmentClosed {
    constructor(treatmentId) {
        this.treatmentId = treatmentId;
    }
}
exports.HospitalTreatmentClosed = HospitalTreatmentClosed;
