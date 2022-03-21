"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEventBus = void 0;
class TestEventBus {
    constructor() {
        this._handlers = new Map();
    }
    on(eventName, eventHandler) {
        const handlers = this._handlers.get(eventName);
        if (handlers === undefined)
            this._handlers.set(eventName, [eventHandler]);
        else
            handlers.push(eventHandler);
        return this;
    }
    emit(event) {
        const handlers = this._handlers.get(event.constructor.name);
        if (handlers)
            handlers.forEach(handler => handler(event));
    }
}
exports.TestEventBus = TestEventBus;
