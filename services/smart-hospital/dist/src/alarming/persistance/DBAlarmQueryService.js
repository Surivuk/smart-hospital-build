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
exports.DBAlarmQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBAlarmQueryServiceError extends Error {
    constructor(message) {
        super(`[DBAlarmQueryService] Error - ${message}`);
    }
}
exports.DBAlarmQueryServiceError = DBAlarmQueryServiceError;
class DBAlarmQueryService extends KnexConnector_1.default {
    alarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alarm = yield this.knex("alarming.alarm").where({ id: id.toString() });
                if (alarm.length === 0)
                    throw new Error(`Not found alarm for provided id. Id: "${id.toString()}"`);
                const triggers = yield this.knex("alarming.alarm_triggers").where({ alarm: alarm[0].id });
                return this.toAlarmReadModel(alarm[0], triggers);
            }
            catch (error) {
                throw new DBAlarmQueryServiceError(`[alarm] - ${error.message}`);
            }
        });
    }
    alarms(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alarms = yield this.knex("alarming.alarm").where({ doctor: doctorId.toString() });
                const triggers = yield this.knex("alarming.alarm_triggers").whereIn("alarm", alarms.map(row => row.id));
                return alarms.map(alarm => this.toAlarmReadModel(alarm, triggers));
            }
            catch (error) {
                throw new DBAlarmQueryServiceError(`[alarms] - ${error.message}`);
            }
        });
    }
    toAlarmReadModel(alarm, triggers) {
        const trigger = triggers.filter(trigger => trigger.alarm === alarm.id)[0];
        return {
            id: alarm.id,
            hospitalTreatment: alarm.hospital_treatment,
            name: alarm.name,
            trigger: {
                key: trigger.key,
                value: trigger.value,
                operator: trigger.operator
            },
            active: alarm.active
        };
    }
}
exports.default = DBAlarmQueryService;
