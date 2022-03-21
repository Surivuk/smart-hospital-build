"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmOperatorError = void 0;
class AlarmOperatorError extends Error {
    constructor(message) {
        super(`[AlarmOperator] Error - ${message}`);
    }
}
exports.AlarmOperatorError = AlarmOperatorError;
class AlarmOperator {
    constructor(_operator) {
        this._operator = _operator;
    }
    static create(operator) {
        if (["AND", "OR"].indexOf(operator.toUpperCase()) === -1)
            throw new AlarmOperatorError(`Provided operator is not supported. Operator: "${operator}"`);
        return new AlarmOperator(operator.toUpperCase());
    }
    toString() {
        return this._operator;
    }
}
exports.default = AlarmOperator;
