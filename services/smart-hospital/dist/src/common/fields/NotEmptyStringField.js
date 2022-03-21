"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotEmptyStringFieldError = void 0;
class NotEmptyStringFieldError extends Error {
    constructor(message) {
        super(`[NotEmptyStringField] Error - ${message}`);
    }
}
exports.NotEmptyStringFieldError = NotEmptyStringFieldError;
class NotEmptyStringField {
    constructor(_value) {
        this._value = _value;
    }
    static create(value, tag) {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null || value.length === 0)
            throw new NotEmptyStringFieldError(`Provided value is undefined or null or empty. ${printTag}`);
        return new NotEmptyStringField(value);
    }
    toString() {
        return this._value;
    }
    equals(field) {
        return this._value === field.toString();
    }
}
exports.default = NotEmptyStringField;
