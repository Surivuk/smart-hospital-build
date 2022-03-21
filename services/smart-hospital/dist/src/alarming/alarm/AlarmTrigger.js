"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlarmTrigger {
    constructor(_dataKey, _value, _operator) {
        this._dataKey = _dataKey;
        this._value = _value;
        this._operator = _operator;
    }
    mineResponsibility(data) {
        return this._dataKey.toString() === data.type;
    }
    triggered(data) {
        return this._operator.triggered(this._value.toString(), data.value);
    }
    dto() {
        return {
            key: this._dataKey.toString(),
            value: this._value.toString(),
            operator: this._operator.toString()
        };
    }
}
exports.default = AlarmTrigger;
