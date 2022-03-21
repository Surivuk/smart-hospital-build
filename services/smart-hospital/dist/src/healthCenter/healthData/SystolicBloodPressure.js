"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HealthData_1 = __importDefault(require("./HealthData"));
class SystolicBloodPressure extends HealthData_1.default {
    constructor(_timestamp, _value) {
        super();
        this._timestamp = _timestamp;
        this._value = _value;
    }
    type() {
        return "systolic-blood-pressure";
    }
    value() {
        return `${this._value}`;
    }
    timestamp() {
        return this._timestamp;
    }
    isNormal() {
        return this._value <= 140;
    }
    isWarning() {
        return this._value > 140 && this._value <= 160;
    }
    isCritical() {
        return this._value > 160;
    }
}
exports.default = SystolicBloodPressure;
