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
const MedicationEvents_1 = require("../events/MedicationEvents");
class MonitoringEventHandlers {
    constructor(_monitoringRepository) {
        this._monitoringRepository = _monitoringRepository;
    }
    registerHandlers(eventBus) {
        eventBus
            .on(MedicationEvents_1.HospitalTreatmentOpened.name, ({ treatmentId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._monitoringRepository.connectToFirstAvailableMonitoring(treatmentId);
            }
            catch (error) {
                // emit NOT AVAILABLE MONITORING DEVICES 
                throw error;
            }
        }))
            .on(MedicationEvents_1.HospitalTreatmentClosed.name, ({ treatmentId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._monitoringRepository.disconnectTreatmentFormMonitoring(treatmentId);
            }
            catch (error) {
                throw error;
            }
        }));
    }
}
exports.default = MonitoringEventHandlers;
