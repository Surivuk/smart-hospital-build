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
class NotificationEventHandlers {
    constructor(_socket, _query, _treatmentQuery) {
        this._socket = _socket;
        this._query = _query;
        this._treatmentQuery = _treatmentQuery;
    }
    registerHandlers(eventBus) {
        eventBus
            .on(AlarmingEvents_1.AlarmTriggered.name, ({ treatmentId, alarmId, healthData }) => __awaiter(this, void 0, void 0, function* () {
            const treatment = yield this._treatmentQuery.treatment(treatmentId);
            const { name, trigger, hospitalTreatment } = yield this._query.alarm(alarmId);
            this._socket.sendMessage(`alarms`, {
                message: `${name} - [${trigger.key}] (${healthData.value} ${trigger.operator} ${trigger.value})`,
                link: `/app/medical-card/${treatment.medicalCard}/hospital-treatments/${hospitalTreatment}`
            });
        }))
            .on(MonitoringEvents_1.HealthDataReceived.name, ({ treatmentId, healthData }) => __awaiter(this, void 0, void 0, function* () {
            this._socket.sendMessage(`hospital-treatment/${treatmentId.toString()}/data`, healthData);
        }));
    }
}
exports.default = NotificationEventHandlers;
