"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAlarm = exports.DeactivateAlarm = exports.ActivateAlarm = exports.CreateAlarm = void 0;
class CreateAlarm {
    constructor(doctorId, alarm) {
        this.doctorId = doctorId;
        this.alarm = alarm;
    }
}
exports.CreateAlarm = CreateAlarm;
class ActivateAlarm {
    constructor(alarmId) {
        this.alarmId = alarmId;
    }
}
exports.ActivateAlarm = ActivateAlarm;
class DeactivateAlarm {
    constructor(alarmId) {
        this.alarmId = alarmId;
    }
}
exports.DeactivateAlarm = DeactivateAlarm;
class DeleteAlarm {
    constructor(alarmId) {
        this.alarmId = alarmId;
    }
}
exports.DeleteAlarm = DeleteAlarm;
