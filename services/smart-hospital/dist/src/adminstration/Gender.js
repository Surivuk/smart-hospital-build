"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenderError = void 0;
class GenderError extends Error {
    constructor(message) {
        super(`[Gender] Error - ${message}`);
    }
}
exports.GenderError = GenderError;
class Gender {
    constructor(_gender) {
        this._gender = _gender;
    }
    static create(gender) {
        if (["male", "female"].indexOf(gender) === -1)
            throw new GenderError(`Provided gender is not valid. Gender: "${gender}"`);
        return new Gender(gender);
    }
    equals(gender) {
        return this._gender === gender._gender;
    }
    toString() {
        return this._gender;
    }
}
exports.default = Gender;
