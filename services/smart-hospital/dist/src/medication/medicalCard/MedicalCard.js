"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AggregateRoot_1 = require("../../common/AggregateRoot");
const MedicalCardEvents_1 = require("./MedicalCardEvents");
class MedicalCard extends AggregateRoot_1.AggregateRoot {
    static create(id, patientId) {
        const result = new MedicalCard();
        result.createMedicalCard(id, patientId);
        return result;
    }
    noteHospitalTreatment(hospitalTreatmentId) {
        this.applyChange(new MedicalCardEvents_1.TreatmentNotedToMedicalCard(this._id, hospitalTreatmentId));
    }
    noteExamination(examinationId) {
        this.applyChange(new MedicalCardEvents_1.ExaminationNotedToMedicalCard(this._id, examinationId));
    }
    noteTherapy(therapyId) {
        this.applyChange(new MedicalCardEvents_1.TherapyNotedToMedicalCard(this._id, therapyId));
    }
    apply(event) {
        if (event instanceof MedicalCardEvents_1.MedicalCardCreated)
            this.applyMedicalCardCreated(event);
    }
    applyMedicalCardCreated(event) {
        this._id = event.medicalCardId;
    }
    createMedicalCard(id, patientId) {
        this.applyChange(new MedicalCardEvents_1.MedicalCardCreated(id, patientId));
    }
}
exports.default = MedicalCard;
