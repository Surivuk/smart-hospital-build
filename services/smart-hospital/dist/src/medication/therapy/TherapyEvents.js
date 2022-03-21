"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TherapyLabelChanged = exports.MedicamentRemovedFromTherapy = exports.MedicamentAddedToTherapy = exports.TherapyCreated = void 0;
class TherapyCreated {
    constructor(therapyId, label, type) {
        this.therapyId = therapyId;
        this.label = label;
        this.type = type;
    }
}
exports.TherapyCreated = TherapyCreated;
class MedicamentAddedToTherapy {
    constructor(therapyId, medicament) {
        this.therapyId = therapyId;
        this.medicament = medicament;
    }
}
exports.MedicamentAddedToTherapy = MedicamentAddedToTherapy;
class MedicamentRemovedFromTherapy {
    constructor(therapyId, medicamentId) {
        this.therapyId = therapyId;
        this.medicamentId = medicamentId;
    }
}
exports.MedicamentRemovedFromTherapy = MedicamentRemovedFromTherapy;
class TherapyLabelChanged {
    constructor(therapyId, label) {
        this.therapyId = therapyId;
        this.label = label;
    }
}
exports.TherapyLabelChanged = TherapyLabelChanged;
