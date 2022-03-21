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
exports.DBAlarmRepositoryError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
const NotEmptyStringField_1 = __importDefault(require("../../common/fields/NotEmptyStringField"));
const Guid_1 = __importDefault(require("../../common/Guid"));
const Alarm_1 = __importDefault(require("../alarm/Alarm"));
const AlarmTrigger_1 = __importDefault(require("../alarm/AlarmTrigger"));
const TriggerOperation_1 = __importDefault(require("../alarm/TriggerOperation"));
class DBAlarmRepositoryError extends Error {
    constructor(message) {
        super(`[DBAlarmRepository] Error - ${message}`);
    }
}
exports.DBAlarmRepositoryError = DBAlarmRepositoryError;
class DBAlarmRepository extends KnexConnector_1.default {
    constructor() {
        super(...arguments);
        this._alarm = "alarming.alarm";
        this._alarm_triggers = "alarming.alarm_triggers";
    }
    createAlarm(doctorId, alarm) {
        return __awaiter(this, void 0, void 0, function* () {
            let trx;
            try {
                trx = yield this.knex.transaction();
                const { id, name, trigger, treatmentId } = alarm.dto();
                yield this.knex(this._alarm)
                    .transacting(trx)
                    .insert({
                    id,
                    doctor: doctorId.toString(),
                    hospital_treatment: treatmentId,
                    name,
                    created_at: this.knex.fn.now()
                });
                yield this.knex(this._alarm_triggers)
                    .transacting(trx)
                    .insert({
                    alarm: id,
                    key: trigger.key,
                    value: trigger.value,
                    operator: trigger.operator,
                    created_at: this.knex.fn.now()
                });
                yield trx.commit();
            }
            catch (error) {
                yield trx.rollback();
                throw new DBAlarmRepositoryError(`[createAlarm] - ${error.message}`);
            }
        });
    }
    deleteAlarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knex(this._alarm).where({ id: id.toString() }).delete();
            }
            catch (error) {
                throw new DBAlarmRepositoryError(`[deleteAlarm] - ${error.message}`);
            }
        });
    }
    activateAlarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knex(this._alarm).update({ active: true, changed_active_at: this.knex.fn.now() }).where({ id: id.toString() });
            }
            catch (error) {
                throw new DBAlarmRepositoryError(`[activateAlarm] - ${error.message}`);
            }
        });
    }
    deactivateAlarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knex(this._alarm).update({ active: false, changed_active_at: this.knex.fn.now() }).where({ id: id.toString() });
            }
            catch (error) {
                throw new DBAlarmRepositoryError(`[deactivateAlarm] - ${error.message}`);
            }
        });
    }
    alarm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alarm = yield this.knex(this._alarm).where({ id: id.toString() });
                if (alarm.length === 0)
                    throw new Error(`Not found alarm for provided id. Id: "${id.toString()}"`);
                const triggers = yield this.knex(this._alarm_triggers).where({ alarm: alarm[0].id });
                return this.toAlarm(alarm[0], triggers);
            }
            catch (error) {
                throw new DBAlarmRepositoryError(`[alarm] - ${error.message}`);
            }
        });
    }
    activeAlarms(treatmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alarms = yield this.knex(this._alarm).where({ hospital_treatment: treatmentId.toString(), active: true });
                const triggers = yield this.knex(this._alarm_triggers).whereIn("alarm", alarms.map(alarm => alarm.id));
                return alarms.map(row => this.toAlarm(row, triggers));
            }
            catch (error) {
                throw new DBAlarmRepositoryError(`[alarms] - ${error.message}`);
            }
        });
    }
    toAlarm(alarm, triggers) {
        const trigger = triggers.filter(trigger => trigger.alarm === alarm.id)[0];
        return new Alarm_1.default(new Guid_1.default(alarm.id), new Guid_1.default(alarm.hospital_treatment), NotEmptyStringField_1.default.create(alarm.name), new AlarmTrigger_1.default(NotEmptyStringField_1.default.create(trigger.key), NotEmptyStringField_1.default.create(trigger.value), TriggerOperation_1.default.create(trigger.operator)));
    }
}
exports.default = DBAlarmRepository;
