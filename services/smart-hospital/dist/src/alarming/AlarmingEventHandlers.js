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
const AlarmingEvents_1 = require("../events/AlarmingEvents");
const MonitoringEvents_1 = require("../events/MonitoringEvents");
class AlarmingEventHandlers {
    constructor(_alarmRepository, _alarmNotificationRepository) {
        this._alarmRepository = _alarmRepository;
        this._alarmNotificationRepository = _alarmNotificationRepository;
    }
    registerHandlers(eventBus) {
        eventBus
            .on(MonitoringEvents_1.HealthDataReceived.name, ({ treatmentId, healthData }) => __awaiter(this, void 0, void 0, function* () {
            const triggeredAlarms = (yield this._alarmRepository.activeAlarms(treatmentId)).filter(alarm => alarm.triggered(healthData));
            yield this._alarmNotificationRepository.saveAlarmNotification(healthData, triggeredAlarms);
            triggeredAlarms.map(alarm => new AlarmingEvents_1.AlarmTriggered(treatmentId, alarm.id, healthData)).forEach(event => eventBus.emit(event));
        }));
    }
}
exports.default = AlarmingEventHandlers;
