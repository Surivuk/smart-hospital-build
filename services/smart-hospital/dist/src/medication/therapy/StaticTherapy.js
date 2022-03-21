"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticTherapyChangeError = void 0;
class StaticTherapyChangeError extends Error {
    constructor() {
        super("Forbidden to make any changes to the static therapy");
    }
}
exports.StaticTherapyChangeError = StaticTherapyChangeError;
class StaticTherapyWrapper {
    constructor(_therapy) {
        this._therapy = _therapy;
    }
    get id() {
        return this._therapy.id;
    }
    addMedicament(medicament) {
        throw new StaticTherapyChangeError();
    }
    addMedicaments(medicaments) {
        throw new StaticTherapyChangeError();
    }
    removeMedicament(medicamentId) {
        throw new StaticTherapyChangeError();
    }
    changeLabel(newLabel) {
        throw new StaticTherapyChangeError();
    }
    uncommittedChanges() {
        return this._therapy.uncommittedChanges();
    }
    markChangesAsCommitted() {
        this._therapy.markChangesAsCommitted();
    }
    loadsFromHistory(history) {
        this._therapy.loadsFromHistory(history);
    }
}
exports.default = StaticTherapyWrapper;
