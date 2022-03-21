"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExaminationError = void 0;
const AggregateRoot_1 = require("../../common/AggregateRoot");
const ExaminationEvents_1 = require("./ExaminationEvents");
class ExaminationError extends Error {
    constructor(message) {
        super(`[Examination] Error - ${message}`);
    }
}
exports.ExaminationError = ExaminationError;
class Examination extends AggregateRoot_1.AggregateRoot {
    static create(id, doctorId, diagnose) {
        const result = new Examination();
        result.applyChange(new ExaminationEvents_1.ExaminationCreated(id, doctorId, diagnose));
        return result;
    }
    addNote(note, doctorId) {
        this.applyChange(new ExaminationEvents_1.NoteAddedToExamination(this._id, doctorId, note));
    }
    apply(event) {
        if (event instanceof ExaminationEvents_1.ExaminationCreated)
            this.applyExaminationCreated(event);
    }
    applyExaminationCreated(event) {
        this._id = event.examinationId;
    }
}
exports.default = Examination;
