"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringError = void 0;
class MonitoringError extends Error {
    constructor(message) {
        super(`[Monitoring] Error - ${message}`);
    }
}
exports.MonitoringError = MonitoringError;
class Monitoring {
    constructor(id, hospitalTreatmentId, _monitors) {
        this.id = id;
        this.hospitalTreatmentId = hospitalTreatmentId;
        this._monitors = _monitors;
    }
    healthData(data) {
        const { type, value } = data;
        if (!this.monitor(type).isValueInRange(value))
            throw new MonitoringError(`Provided health data is not in proper range. Type: "${type}", Value: "${value}"`);
        return data;
    }
    monitor(type) {
        const monitor = this._monitors[type];
        if (monitor === undefined)
            throw new MonitoringError(`Not supported type. Provided type: "${type}"`);
        return monitor;
    }
}
exports.default = Monitoring;
