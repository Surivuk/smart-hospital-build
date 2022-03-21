"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmError = void 0;
class AlarmError extends Error {
    constructor(message) {
        super(`[Alarm] Error - ${message}`);
    }
}
exports.AlarmError = AlarmError;
class Alarm {
    constructor(id, _treatmentId, _name, _trigger) {
        this.id = id;
        this._treatmentId = _treatmentId;
        this._name = _name;
        this._trigger = _trigger;
    }
    triggered(data) {
        if (this._trigger.mineResponsibility(data))
            return this._trigger.triggered(data);
        return false;
    }
    dto() {
        return {
            id: this.id.toString(),
            treatmentId: this._treatmentId.toString(),
            name: this._name.toString(),
            trigger: this._trigger.dto()
        };
    }
}
exports.default = Alarm;
