"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function generateParameter(parameterName, min, max, timestamp, decimalFix) {
    return {
        type: parameterName,
        timestamp: timestamp,
        value: generateRandomNumber(min, max, decimalFix),
    };
}
function generateRandomNumber(min, max, decimalFix) {
    const value = Math.random() * (max - min) + min;
    if (decimalFix)
        return value.toFixed(decimalFix);
    return `${Math.floor(value)}`;
}
const defaultValues = {
    SPO2: { min: 95, max: 99 },
    "systolic-blood-pressure": { min: 120, max: 140 },
    "diastolic-blood-pressure": { min: 80, max: 90 },
    PI: { min: 0, max: 3, decimalFix: 3 },
    temperature: { min: 36, max: 37, decimalFix: 1 },
    pulse: { min: 60, max: 80 },
};
class Device {
    constructor(id, publish) {
        this.id = id;
        this.publish = publish;
        this._intervalId = undefined;
        this._change = undefined;
        this._profile = "normal";
        this._reportTime = 5;
        this._baseTopic = "";
        this._baseTopic = `monitoring/${id}`;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._intervalId !== undefined)
                return;
            this._intervalId = this.loop(this._reportTime);
            this.publish(`${this._baseTopic}/status`, { status: "started" });
        });
    }
    stop() {
        if (this._intervalId === undefined)
            return;
        clearInterval(this._intervalId);
        this._intervalId = undefined;
        this.publish(`${this._baseTopic}/status`, { status: "stopped" });
    }
    changeReportTime(time) {
        this._reportTime = time;
        if (this._intervalId !== undefined) {
            clearInterval(this._intervalId);
            this._intervalId = this.loop(this._reportTime);
        }
        this.publish(`${this._baseTopic}/status`, { reportTime: this._reportTime });
    }
    changeProfile(profile) {
        this._change = Device.CHANGES[profile];
        this._profile = profile;
        this.publish(`${this._baseTopic}/status`, { profile: this._profile });
    }
    info() {
        this.publish(`${this._baseTopic}/status`, { status: this._intervalId !== undefined ? "started" : "stopped" });
        this.publish(`${this._baseTopic}/status`, { profile: this._profile });
        this.publish(`${this._baseTopic}/status`, { reportTime: this._reportTime });
    }
    loop(seconds) {
        return setInterval(() => {
            const timestamp = new Date().getTime();
            const keys = Object.keys(defaultValues);
            const source = this._change ? Object.assign(Object.assign({}, defaultValues), this._change) : defaultValues;
            keys.forEach((key) => {
                const { min, max, decimalFix } = source[key];
                const data = generateParameter(key, min, max, timestamp, decimalFix);
                this.publish(`${this._baseTopic}/data`, data);
            });
        }, 1000 * seconds);
    }
}
exports.default = Device;
Device.CHANGES = {
    "normal": {},
    "worrying saturation": { SPO2: { min: 90, max: 94 } },
    "critical saturation": { SPO2: { min: 75, max: 89 } },
    "elevated temperature": { temperature: { min: 37, max: 39, decimalFix: 1 } },
    "high temperature": { temperature: { min: 39, max: 42, decimalFix: 1 } },
};
;
