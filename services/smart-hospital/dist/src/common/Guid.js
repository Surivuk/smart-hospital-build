"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidFactory = exports.GuidError = void 0;
const crypto_1 = require("crypto");
class GuidError extends Error {
    constructor(message) {
        super(`[Guid] Error - ${message}`);
    }
}
exports.GuidError = GuidError;
class Guid {
    constructor(_value) {
        this._value = _value;
    }
    static create(value, tag) {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null || value.length === 0)
            throw new GuidError(`Provided value is undefined or empty. ${printTag()}`);
        return new Guid(value);
    }
    equals(obj) {
        return this._value === obj._value;
    }
    toString() {
        return this._value;
    }
}
exports.default = Guid;
class GuidFactory {
    static guid() {
        return new Guid((0, crypto_1.randomBytes)(16).toString('hex'));
    }
}
exports.GuidFactory = GuidFactory;
