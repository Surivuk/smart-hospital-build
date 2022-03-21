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
exports.DBAlarmNotificationRepositoryError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBAlarmNotificationRepositoryError extends Error {
    constructor(message) {
        super(`[DBAlarmNotificationRepository] Error - ${message}`);
    }
}
exports.DBAlarmNotificationRepositoryError = DBAlarmNotificationRepositoryError;
class DBAlarmNotificationRepository extends KnexConnector_1.default {
    saveAlarmNotification(healthData, alarms) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (alarms.length > 0)
                    yield this.knex("alarming.alarm_notifications").insert(alarms.map(alarm => ({
                        alarm: alarm.id.toString(),
                        data_type: healthData.type,
                        data_value: healthData.value,
                        created_at: this.knex.fn.now()
                    })));
            }
            catch (error) {
                throw new DBAlarmNotificationRepositoryError(`[saveAlarmNotification] - ${error.message}`);
            }
        });
    }
}
exports.default = DBAlarmNotificationRepository;
