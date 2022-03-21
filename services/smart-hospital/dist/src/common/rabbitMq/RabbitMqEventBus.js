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
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitMq_1 = require("./rabbitMq");
class RabbitMqEventBus {
    constructor(_channel, _adapter) {
        this._channel = _channel;
        this._adapter = _adapter;
        this._exchanger = "domain.event";
        this._handlers = [];
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._queue = yield (0, rabbitMq_1.queue)(this._channel);
            const queueName = this._queue.queue;
            this.assertExchange(this._exchanger);
            this._channel.bindQueue(queueName, this._exchanger, '');
            this._channel.consume(queueName, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg === null)
                    return;
                if (msg.content) {
                    const { eventName, data } = JSON.parse(msg.content.toString());
                    try {
                        // const { eventName, data } = JSON.parse(msg.content.toString())
                        const eventHandlers = this.handlers(eventName);
                        if (eventHandlers.length === 0)
                            throw new Error(`Not found handler for event. Event: "${eventName}"`);
                        yield Promise.all(eventHandlers.map(handler => handler(this._adapter.toEvent(eventName, data))));
                    }
                    catch (error) {
                        console.log(`[EVENT BUS] -> [${eventName}] - ${error.message}`);
                    }
                }
            }), { noAck: true });
        });
    }
    on(eventName, eventHandler) {
        this._handlers.push({ eventName, handler: eventHandler });
        return this;
    }
    emit(event) {
        this.assertExchange(this._exchanger);
        this._channel.publish(this._exchanger, '', Buffer.from(JSON.stringify({ eventName: event.constructor.name, data: this._adapter.toJSON(event) })));
    }
    assertExchange(exchanger) {
        this._channel.assertExchange(exchanger, 'fanout', { durable: false, autoDelete: true });
    }
    handlers(eName) {
        return this._handlers.filter(({ eventName }) => eventName === eName).map(({ handler }) => handler);
    }
}
exports.default = RabbitMqEventBus;
