"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicConfig_1 = __importDefault(require("./BasicConfig"));
class Config extends BasicConfig_1.default {
    constructor(env) {
        super();
        this.config = this.parseConfig(env);
    }
    parseConfig(env) {
        return {
            port: this.convertToNumber("PORT", env.PORT),
            eventStore: this.convertToString("EVENT_STORE_URL", env.EVENT_STORE_URL),
            mqtt: this.convertToString("MQTT_URL", env.MQTT_URL),
            rabbitMq: this.convertToString("RABBIT_MQ_URL", env.RABBIT_MQ_URL),
            smartHospitalUi: this.convertToString("SMART_HOSPITAL_UI", env.SMART_HOSPITAL_UI),
        };
    }
}
exports.default = Config;
