"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientReadModel = void 0;
class PatientReadModel {
    constructor(id, firstName, lastName, birthYear, gender) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthYear = birthYear;
        this.gender = gender;
    }
}
exports.PatientReadModel = PatientReadModel;
