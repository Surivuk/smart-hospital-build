"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TherapyTypeError = void 0;
class TherapyTypeError extends Error {
    constructor(message) {
        super(`[TherapyType] Error - ${message}`);
    }
}
exports.TherapyTypeError = TherapyTypeError;
class TherapyType {
    constructor(_type) {
        this._type = _type;
    }
    static static() {
        return new TherapyType("static");
    }
    static dynamic() {
        return new TherapyType("dynamic");
    }
    static fromString(value) {
        if (["dynamic", "static"].indexOf(value) === -1)
            throw new TherapyTypeError(`Provided string is not supported type. Type: "${value}"`);
        return new TherapyType(value);
    }
    isStatic() {
        return this._type === "static";
    }
    toString() {
        return this._type;
    }
}
exports.default = TherapyType;
