"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerOperationError = void 0;
class TriggerOperationError extends Error {
    constructor(message) {
        super(`[TriggerOperation] Error - ${message}`);
    }
}
exports.TriggerOperationError = TriggerOperationError;
class TriggerOperator {
    constructor(_operator) {
        this._operator = _operator;
    }
    static create(operation) {
        if (["=", "<", ">"].indexOf(operation) === -1)
            throw new TriggerOperationError(`Provided operator is not supported. Operator: "${operation}"`);
        return new TriggerOperator(operation);
    }
    triggered(referentValue, arrivedValue) {
        if (this.isBoolean(referentValue) && this.isBoolean(arrivedValue))
            return this.check(this.boolean(referentValue), this.boolean(arrivedValue));
        if (this.isNumber(referentValue) && this.isNumber(arrivedValue))
            return this.check(this.number(referentValue), this.number(arrivedValue));
        return this.check(referentValue, arrivedValue);
    }
    isBoolean(value) {
        return value === "true" || value === "false";
    }
    isNumber(value) {
        return !isNaN(parseInt(value)) || !isNaN(parseFloat(value));
    }
    boolean(value) {
        return value === "true" ? true : false;
    }
    number(value) {
        if (value.indexOf('.') === -1)
            return parseInt(value);
        return parseFloat(value);
    }
    check(a, b) {
        if (this._operator === "<")
            return b < a;
        if (this._operator === ">")
            return b > a;
        return a === b;
    }
    toString() {
        return this._operator;
    }
}
exports.default = TriggerOperator;
