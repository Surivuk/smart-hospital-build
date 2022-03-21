"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalStringFieldError = void 0;
class NormalStringFieldError extends Error {
    constructor(message) {
        super(`[NormalStringField] Error - ${message}`);
    }
}
exports.NormalStringFieldError = NormalStringFieldError;
class NormalStringField {
    constructor(_value) {
        this._value = _value;
    }
    static create(value, tag) {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null)
            throw new NormalStringFieldError(`Provided value is undefined or null. ${printTag}`);
        return new NormalStringField(value);
    }
    toString() {
        return this._value;
    }
    equals(field) {
        return this._value === field.toString();
    }
}
exports.default = NormalStringField;
