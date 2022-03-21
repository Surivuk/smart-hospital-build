"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Alarm_1 = __importDefault(require("../../../../alarming/alarm/Alarm"));
const AlarmTrigger_1 = __importDefault(require("../../../../alarming/alarm/AlarmTrigger"));
const TriggerOperation_1 = __importDefault(require("../../../../alarming/alarm/TriggerOperation"));
const AlarmingCommands_1 = require("../../../../commands/AlarmingCommands");
const NotEmptyStringField_1 = __importDefault(require("../../../../common/fields/NotEmptyStringField"));
const Guid_1 = __importStar(require("../../../../common/Guid"));
class AlarmingController {
    constructor(_query, _notificationQuery, _commandChain) {
        this._query = _query;
        this._notificationQuery = _notificationQuery;
        this._commandChain = _commandChain;
    }
    createAlarm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId, treatmentId, name, trigger } = req.body;
            const alarmId = Guid_1.GuidFactory.guid();
            yield this._commandChain.process(new AlarmingCommands_1.CreateAlarm(Guid_1.default.create(doctorId), new Alarm_1.default(alarmId, Guid_1.default.create(treatmentId), NotEmptyStringField_1.default.create(name), new AlarmTrigger_1.default(NotEmptyStringField_1.default.create(trigger.key), NotEmptyStringField_1.default.create(trigger.value), TriggerOperation_1.default.create(trigger.operator)))));
            res.header("Location", `/alarm/${alarmId.toString()}`);
            res.sendStatus(201);
        });
    }
    activateAlarm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._commandChain.process(new AlarmingCommands_1.ActivateAlarm(Guid_1.default.create(req.params.id)));
            res.sendStatus(204);
        });
    }
    deactivateAlarm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._commandChain.process(new AlarmingCommands_1.DeactivateAlarm(Guid_1.default.create(req.params.id)));
            res.sendStatus(204);
        });
    }
    deleteAlarm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._commandChain.process(new AlarmingCommands_1.DeleteAlarm(Guid_1.default.create(req.params.id)));
            res.sendStatus(204);
        });
    }
    alarms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.query;
            res.json(yield this._query.alarms(Guid_1.default.create(doctorId)));
        });
    }
    alarm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield this._query.alarm(Guid_1.default.create(req.params.id)));
        });
    }
    alarmNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield this._notificationQuery.notifications(Guid_1.default.create(req.params.id)));
        });
    }
}
exports.default = AlarmingController;
