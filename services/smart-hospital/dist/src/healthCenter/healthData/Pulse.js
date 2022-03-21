"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HealthData_1 = __importDefault(require("./HealthData"));
class Pulse extends HealthData_1.default {
    constructor(_timestamp, _value) {
        super();
        this._timestamp = _timestamp;
        this._value = _value;
    }
    type() {
        return "pulse";
    }
    value() {
        return `${this._value}`;
    }
    timestamp() {
        return this._timestamp;
    }
    isNormal() {
        return this._value >= 60 && this._value <= 80;
    }
    isWarning() {
        return this._value > 80 && this._value <= 120 || this._value < 60 && this._value >= 40;
    }
    isCritical() {
        return this._value < 40 || this._value > 120;
    }
}
exports.default = Pulse;
