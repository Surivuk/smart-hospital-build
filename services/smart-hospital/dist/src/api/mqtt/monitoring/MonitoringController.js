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
const MonitoringCommands_1 = require("../../../commands/MonitoringCommands");
const Guid_1 = __importDefault(require("../../../common/Guid"));
class MonitoringController {
    constructor(_commandChain) {
        this._commandChain = _commandChain;
    }
    processData(topic, { type, timestamp, value }) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(topic, type, timestamp, value)
            const defined = (value) => value !== undefined && value !== null;
            const monitoringId = Guid_1.default.create(topic.split("/")[1]);
            if (!defined(type))
                throw new Error(`[MonitoringController] - Type is undefined`);
            if (!defined(timestamp))
                throw new Error(`[MonitoringController] - Timestamp is undefined`);
            if (!defined(value))
                throw new Error(`[MonitoringController] - Type is undefined`);
            if (isNaN(parseInt(timestamp)))
                throw new Error(`[MonitoringController] - Timestamp is not valid format`);
            yield this._commandChain.process(new MonitoringCommands_1.ProcessHealthData(monitoringId, { type, timestamp, value }));
        });
    }
}
exports.default = MonitoringController;
