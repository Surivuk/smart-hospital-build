"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmTriggered = void 0;
class AlarmTriggered {
    constructor(treatmentId, alarmId, healthData) {
        this.treatmentId = treatmentId;
        this.alarmId = alarmId;
        this.healthData = healthData;
    }
}
exports.AlarmTriggered = AlarmTriggered;
