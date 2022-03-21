"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringSet = void 0;
const AggregateRoot_1 = require("../common/AggregateRoot");
const Guid_1 = __importDefault(require("../common/Guid"));
const MonitoringEvents_1 = require("./MonitoringEvents");
const SPO2_1 = __importDefault(require("./healthData/SPO2"));
class MonitoringSet {
    constructor(_timestamp, _values) {
        this._timestamp = _timestamp;
        this._values = _values;
    }
}
exports.MonitoringSet = MonitoringSet;
class HealthCenter extends AggregateRoot_1.AggregateRoot {
    constructor() {
        super(...arguments);
        this._lastTimestamp = 0;
    }
    processData(data) {
        const value = new SPO2_1.default(data.timestamp, parseInt(data.values[0].value));
        if (this._lastValue !== undefined && !this.hasSameStatus(value, this._lastValue)) {
            if (this._lastTimestamp !== this._lastValue.timestamp())
                this.applyChange(new MonitoringEvents_1.AddedMonitoredValue(new Guid_1.default("mm1"), this._lastValue));
            this.applyChange(new MonitoringEvents_1.AddedMonitoredValue(new Guid_1.default("mm1"), value));
            this._lastValue = value;
            return;
        }
        if ((value.isNormal() && data.timestamp - this._lastTimestamp >= 60000) ||
            (value.isWarning() && data.timestamp - this._lastTimestamp >= 10000) ||
            (value.isCritical() && data.timestamp - this._lastTimestamp >= 5000))
            this.applyChange(new MonitoringEvents_1.AddedMonitoredValue(new Guid_1.default("mm1"), value));
        this._lastValue = value;
    }
    hasSameStatus(v1, v2) {
        return v1.isNormal() === v2.isNormal() &&
            v1.isWarning() === v2.isWarning() &&
            v1.isCritical() === v2.isCritical();
    }
    isTimeForStoring() {
        return false;
    }
    apply(event) {
        if (event instanceof MonitoringEvents_1.AddedMonitoredValue)
            this.applyAddedMonitoredValue(event);
    }
    applyAddedMonitoredValue(event) {
        this._lastTimestamp = event.value.timestamp();
    }
}
exports.default = HealthCenter;
