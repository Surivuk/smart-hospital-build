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
const AlarmingCommands_1 = require("../commands/AlarmingCommands");
class AlarmingProcessor {
    constructor(_eventBus, _alarmRepository) {
        this._eventBus = _eventBus;
        this._alarmRepository = _alarmRepository;
    }
    registerProcesses(commandChain) {
        commandChain
            .registerProcessor(AlarmingCommands_1.CreateAlarm.name, ({ doctorId, alarm }) => __awaiter(this, void 0, void 0, function* () {
            yield this._alarmRepository.createAlarm(doctorId, alarm);
        }))
            .registerProcessor(AlarmingCommands_1.ActivateAlarm.name, ({ alarmId }) => __awaiter(this, void 0, void 0, function* () {
            yield this._alarmRepository.activateAlarm(alarmId);
        }))
            .registerProcessor(AlarmingCommands_1.DeactivateAlarm.name, ({ alarmId }) => __awaiter(this, void 0, void 0, function* () {
            yield this._alarmRepository.deactivateAlarm(alarmId);
        }))
            .registerProcessor(AlarmingCommands_1.DeleteAlarm.name, ({ alarmId }) => __awaiter(this, void 0, void 0, function* () {
            yield this._alarmRepository.deleteAlarm(alarmId);
        }));
    }
}
exports.default = AlarmingProcessor;
