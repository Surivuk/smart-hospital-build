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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdministrationCommands_1 = __importDefault(require("../commands/AdministrationCommands"));
const AdministrationEvents_1 = require("../events/AdministrationEvents");
class AdminstrationProcessor {
    constructor(_patientRepo, _eventBus) {
        this._patientRepo = _patientRepo;
        this._eventBus = _eventBus;
    }
    registerProcesses(commandChain) {
        commandChain
            .registerProcessor(AdministrationCommands_1.default.name, ({ patientId, name, gender, birthYear }) => __awaiter(this, void 0, void 0, function* () {
            yield this._patientRepo.createPatient(patientId, name, gender, birthYear);
            this._eventBus.emit(new AdministrationEvents_1.PatientAdded(patientId));
        }));
    }
}
exports.default = AdminstrationProcessor;
