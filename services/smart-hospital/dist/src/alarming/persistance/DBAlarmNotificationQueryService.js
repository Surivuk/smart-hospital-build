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
exports.DBAlarmNotificationQueryServiceError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
class DBAlarmNotificationQueryServiceError extends Error {
    constructor(message) {
        super(`[DBAlarmNotificationQueryService] Error - ${message}`);
    }
}
exports.DBAlarmNotificationQueryServiceError = DBAlarmNotificationQueryServiceError;
class DBAlarmNotificationQueryService extends KnexConnector_1.default {
    notifications(alarm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex("alarming.alarm_notifications").where({ alarm: alarm.toString() });
                return rows.map(row => this.toNotification(row));
            }
            catch (error) {
                throw new DBAlarmNotificationQueryServiceError(`[notifications] - ${error.message}`);
            }
        });
    }
    toNotification(data) {
        return {
            alarm: data.alarm,
            dataType: data.data_type,
            dataValue: data.data_value,
            createdAt: data.created_at
        };
    }
}
exports.default = DBAlarmNotificationQueryService;
