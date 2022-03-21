"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticTherapyCannotChange = exports.MedicamentAlreadyIncludedInTherapy = void 0;
const AggregateRoot_1 = require("../../common/AggregateRoot");
const TherapyEvents_1 = require("./TherapyEvents");
const TherapyType_1 = __importDefault(require("./TherapyType"));
class MedicamentAlreadyIncludedInTherapy extends Error {
}
exports.MedicamentAlreadyIncludedInTherapy = MedicamentAlreadyIncludedInTherapy;
class StaticTherapyCannotChange extends Error {
    constructor() { super("Static therapy cannot be changed"); }
}
exports.StaticTherapyCannotChange = StaticTherapyCannotChange;
class Therapy extends AggregateRoot_1.AggregateRoot {
    constructor() {
        super(...arguments);
        this._medicaments = new Map();
    }
    static createDynamicTherapy(id, label) {
        const therapy = new Therapy();
        therapy.createTherapy(id, label, TherapyType_1.default.dynamic());
        return therapy;
    }
    static createStaticTherapy(id, label) {
        const therapy = new Therapy();
        therapy.createTherapy(id, label, TherapyType_1.default.static());
        return therapy;
    }
    createTherapy(id, label, type) {
        this.applyChange(new TherapyEvents_1.TherapyCreated(id, label, type));
    }
    addMedicament(medicament) {
        if (this._medicaments.has(medicament.medicamentId.toString()))
            throw new MedicamentAlreadyIncludedInTherapy(`Medicament Id: "${medicament.medicamentId.toString()}"`);
        this.applyChange(new TherapyEvents_1.MedicamentAddedToTherapy(this.id, medicament));
    }
    addMedicaments(medicaments) {
        medicaments.forEach(medicament => this.addMedicament(medicament));
    }
    removeMedicament(medicamentId) {
        if (this._medicaments.has(medicamentId.toString()))
            this.applyChange(new TherapyEvents_1.MedicamentRemovedFromTherapy(this.id, medicamentId));
    }
    changeLabel(newLabel) {
        this.applyChange(new TherapyEvents_1.TherapyLabelChanged(this.id, newLabel));
    }
    apply(event) {
        if (event instanceof TherapyEvents_1.TherapyCreated)
            this.applyTherapyCreated(event);
        if (event instanceof TherapyEvents_1.MedicamentAddedToTherapy)
            this.applyMedicamentAdded(event);
        if (event instanceof TherapyEvents_1.MedicamentRemovedFromTherapy)
            this.applyMedicamentRemovedFromTherapy(event);
    }
    applyTherapyCreated(event) {
        this._id = event.therapyId;
    }
    applyMedicamentAdded(event) {
        this._medicaments.set(event.medicament.medicamentId.toString(), event.medicament);
    }
    applyMedicamentRemovedFromTherapy(event) {
        this._medicaments.delete(event.medicamentId.toString());
    }
}
exports.default = Therapy;
