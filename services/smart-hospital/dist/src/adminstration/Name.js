"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameError = void 0;
class NameError extends Error {
    constructor(message) {
        super(`[Name] Error - ${message}`);
    }
}
exports.NameError = NameError;
class Name {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    static create(firstName, lastName) {
        const isEmptyOrUndefined = (value) => value === null || value === undefined || value.length === 0;
        if (isEmptyOrUndefined(firstName))
            throw new NameError("Provided firstName is undefined or empty");
        if (isEmptyOrUndefined(lastName))
            throw new NameError("Provided lastName is undefined or empty");
        return new Name(firstName, lastName);
    }
    equals(name) {
        return this.firstName === name.firstName &&
            this.lastName === name.lastName;
    }
    fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
exports.default = Name;
