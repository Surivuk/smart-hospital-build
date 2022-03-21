"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalNumberFieldError = void 0;
class NormalNumberFieldError extends Error {
    constructor(message) {
        super(`[NormalNumberField] Error - ${message}`);
    }
}
exports.NormalNumberFieldError = NormalNumberFieldError;
class NormalNumberField {
    constructor(_value) {
        this._value = _value;
    }
    static create(value, tag) {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null)
            throw new NormalNumberFieldError(`Provided value is undefined or null. ${printTag()}`);
        return new NormalNumberField(value);
    }
    value() {
        return this._value;
    }
    equals(field) {
        return this.value() === field.value();
    }
}
exports.default = NormalNumberField;
