"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalTreatmentError = void 0;
const AggregateRoot_1 = require("../../common/AggregateRoot");
const HospitalTreatmentEvents_1 = require("./HospitalTreatmentEvents");
class HospitalTreatmentError extends Error {
    constructor(message) {
        super(`[HospitalTreatment] Error - ${message}`);
    }
}
exports.HospitalTreatmentError = HospitalTreatmentError;
class HospitalTreatment extends AggregateRoot_1.AggregateRoot {
    constructor() {
        super(...arguments);
        this._therapies = [];
        this._closed = false;
    }
    static create(id, diagnosis) {
        const result = new HospitalTreatment();
        result.createHospitalTreatment(id, diagnosis);
        return result;
    }
    addTherapy(therapyId) {
        if (this._closed)
            throw new Error("Hospital treatment is closed. Actions not allowed");
        this.applyChange(new HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment(this.id, therapyId));
    }
    removeTherapy(therapyId) {
        if (this._closed)
            throw new Error("Hospital treatment is closed. Actions not allowed");
        this.applyChange(new HospitalTreatmentEvents_1.TherapyRemovedFromHospitalTreatment(this.id, therapyId));
    }
    closeTreatment() {
        if (!this._closed)
            this.applyChange(new HospitalTreatmentEvents_1.HospitalTreatmentClosed(this.id));
    }
    createHospitalTreatment(id, diagnosis) {
        this.applyChange(new HospitalTreatmentEvents_1.HospitalTreatmentCreated(id, diagnosis));
    }
    applyHospitalTreatmentCreated(event) {
        this._id = event.treatmentId;
    }
    applyTherapyAddedToHospitalTreatment(event) {
        if (this.hasTherapy(event.therapyId))
            throw new HospitalTreatmentError(`Hospital treatment already has that therapy. Treatment: "${this._id.toString()}", Therapy: "${event.therapyId.toString()}"`);
        this._therapies.push(event.therapyId);
    }
    applyRemoveMedicationFromTherapy(event) {
        if (!this.hasTherapy(event.therapyId))
            throw new HospitalTreatmentError(`Hospital treatment does not contain that therapy. Treatment: "${this._id.toString()}", Therapy: "${event.therapyId.toString()}"`);
        this._therapies = this._therapies.filter(therapy => !therapy.equals(event.therapyId));
    }
    applyHospitalTreatmentClosed(event) {
        this._closed = true;
    }
    hasTherapy(therapyId) {
        return this._therapies.find(therapy => therapy.equals(therapyId)) !== undefined;
    }
    apply(event) {
        if (event instanceof HospitalTreatmentEvents_1.HospitalTreatmentCreated)
            this.applyHospitalTreatmentCreated(event);
        if (event instanceof HospitalTreatmentEvents_1.TherapyAddedToHospitalTreatment)
            this.applyTherapyAddedToHospitalTreatment(event);
        if (event instanceof HospitalTreatmentEvents_1.TherapyRemovedFromHospitalTreatment)
            this.applyRemoveMedicationFromTherapy(event);
        if (event instanceof HospitalTreatmentEvents_1.HospitalTreatmentClosed)
            this.applyHospitalTreatmentClosed(event);
    }
}
exports.default = HospitalTreatment;
