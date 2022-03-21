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
const mqtt_1 = __importDefault(require("mqtt"));
class MqttConnection {
    constructor(brokerUrl) {
        this._client = mqtt_1.default.connect(brokerUrl, { username: "smart-hospital", password: "admin" });
    }
    subscribe(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._client.subscribe(topic, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    public(topic, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._client.publish(topic, JSON.stringify(data), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    start(receivers) {
        return __awaiter(this, void 0, void 0, function* () {
            const handlers = new Map();
            receivers.forEach((listener) => {
                listener.handlers.forEach((handler, key) => {
                    handlers.set(key, handler);
                });
            });
            try {
                const subscriptions = Array.from(handlers.keys()).map(topic => this.subscribe(topic));
                yield Promise.all(subscriptions);
            }
            catch (error) {
                throw error;
            }
            this._client.on("message", (topic, payload) => __awaiter(this, void 0, void 0, function* () {
                const matchHandlers = this.findHandlers(handlers, topic);
                if (matchHandlers.length === undefined)
                    return;
                try {
                    yield Promise.all(matchHandlers.map(handler => handler(topic, JSON.parse(payload.toString()))));
                }
                catch (error) {
                    console.log(`[MQTT] - ${error.message}`);
                }
            }));
        });
    }
    findHandlers(handlers, receivedTopic) {
        const result = [];
        const keys = Array.from(handlers.keys()).map(topic => {
            if (topic.indexOf("+") !== -1)
                return { key: topic, regex: new RegExp(topic.replace("+", "([a-zA-Z0-9-]+)"), "g") };
            if (topic.endsWith("/#"))
                return { key: topic, regex: new RegExp(topic.replace("/#", "([/]*)([a-zA-Z0-9-/]*)"), "g") };
            return { key: topic, regex: topic };
        });
        const matchKeys = keys
            .filter(({ regex }) => {
            const match = receivedTopic.match(regex);
            return match === null ? false : match[0] === receivedTopic;
        })
            .map(({ key }) => key);
        handlers.forEach((handler, key) => {
            if (matchKeys.indexOf(key) !== -1)
                result.push(handler);
        });
        return result;
    }
}
exports.default = MqttConnection;
