"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotificationProcessor {
    constructor() { }
    registerProcesses(commandChain) {
        commandChain;
        // .registerProcessor<ProcessHealthData>(ProcessHealthData.name, async ({ monitoringId, data }) => {
        //     const monitor = await this._monitoringRepo.monitoring(monitoringId);
        //     this._eventBus.emit(new HealthDataReceived(monitor.hospitalTreatmentId, monitor.healthData(data)))
        // })
    }
}
exports.default = NotificationProcessor;
