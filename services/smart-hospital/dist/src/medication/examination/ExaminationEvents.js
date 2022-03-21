"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteAddedToExamination = exports.ExaminationCreated = void 0;
class ExaminationCreated {
    constructor(examinationId, doctorId, diagnose) {
        this.examinationId = examinationId;
        this.doctorId = doctorId;
        this.diagnose = diagnose;
    }
}
exports.ExaminationCreated = ExaminationCreated;
class NoteAddedToExamination {
    constructor(examinationId, doctorId, note) {
        this.examinationId = examinationId;
        this.doctorId = doctorId;
        this.note = note;
    }
}
exports.NoteAddedToExamination = NoteAddedToExamination;
