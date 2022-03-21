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
const MonitoringCommands_1 = require("../commands/MonitoringCommands");
const MonitoringEvents_1 = require("../events/MonitoringEvents");
class MonitoringProcessor {
    constructor(_monitoringRepo, _eventBus) {
        this._monitoringRepo = _monitoringRepo;
        this._eventBus = _eventBus;
    }
    registerProcesses(commandChain) {
        commandChain
            .registerProcessor(MonitoringCommands_1.ProcessHealthData.name, ({ monitoringId, data }) => __awaiter(this, void 0, void 0, function* () {
            const monitor = yield this._monitoringRepo.monitoring(monitoringId);
            this._eventBus.emit(new MonitoringEvents_1.HealthDataReceived(monitor.hospitalTreatmentId, monitor.healthData(data)));
        }));
    }
}
exports.default = MonitoringProcessor;
