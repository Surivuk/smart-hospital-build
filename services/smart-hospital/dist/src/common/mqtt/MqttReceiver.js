"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MqttReceiver {
    constructor() {
        this._handlers = new Map();
    }
    get handlers() {
        return this._handlers;
    }
    on(topic, handler) {
        this._handlers.set(topic, handler);
        return this;
    }
}
exports.default = MqttReceiver;
