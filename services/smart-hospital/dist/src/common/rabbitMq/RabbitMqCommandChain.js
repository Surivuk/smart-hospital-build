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
const Guid_1 = require("../Guid");
class SuccessAck {
    constructor() {
        this.type = "success";
        this.value = undefined;
    }
}
class ErrorAck {
    constructor(value) {
        this.value = value;
        this.type = "error";
    }
}
class RabbitMqCommandChain {
    constructor(_serverChannel, _clientChannel, _adapter) {
        this._serverChannel = _serverChannel;
        this._clientChannel = _clientChannel;
        this._adapter = _adapter;
        this._completedAckMap = new Map();
        this._ackWaitingList = [];
        this._processors = new Map();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._serverQueue = yield (0, rabbitMq_1.queue)(this._serverChannel);
            this._serverChannel.prefetch(1);
            this._clientQueue = yield (0, rabbitMq_1.queue)(this._clientChannel);
            // ACK
            this.handleAck();
            // PROCESSOR
            this.handleCommand();
        });
    }
    registerProcessor(commandName, processor) {
        this._processors.set(commandName, processor);
        return this;
    }
    process(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const correlationId = Guid_1.GuidFactory.guid().toString();
            const message = (command) => {
                return JSON.stringify({
                    name: command.constructor.name,
                    command: this._adapter.serialize(command)
                });
            };
            const result = this._clientChannel.sendToQueue(this._serverQueue.queue, Buffer.from(message(command)), {
                correlationId: correlationId,
                replyTo: this._clientQueue.queue
            });
            if (result) {
                this._ackWaitingList.push(correlationId);
                const ack = yield this.waitOnAck(correlationId);
                if (ack.type === "success")
                    return;
                else
                    throw new Error(`[${command.constructor.name}] - ${ack.value}`);
                // console.log(`[COMMAND CHAIN] ${ack.value}`);
            }
            else
                console.log("[COMMAND CHAIN] Command not sent");
        });
    }
    handleCommand() {
        this._serverChannel.consume(this._serverQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg === null)
                return;
            const ack = (ack) => {
                this._serverChannel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(ack)), { correlationId: msg.properties.correlationId });
                this._serverChannel.ack(msg);
            };
            const message = JSON.parse(msg.content.toString());
            const command = this._adapter.deserialize(message.name, message.command);
            try {
                const processor = this._processors.get(message.name);
                if (processor === undefined)
                    throw new Error(`Not found registered processor for command. Command name: "${message.name}"`);
                yield processor(command);
                ack(new SuccessAck());
            }
            catch (error) {
                ack(new ErrorAck(error.message));
            }
        }));
    }
    handleAck() {
        this._clientChannel.consume(this._clientQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg === null)
                return;
            if (this._ackWaitingList.indexOf(msg.properties.correlationId) !== -1) {
                this._completedAckMap.set(msg.properties.correlationId, JSON.parse(msg.content.toString()));
                var index = this._ackWaitingList.indexOf(msg.properties.correlationId);
                if (index !== -1)
                    this._ackWaitingList.splice(index, 1);
            }
        }), { noAck: true });
    }
    waitOnAck(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let times = 20;
                const check = () => {
                    setTimeout(() => {
                        const ack = this._completedAckMap.get(correlationId);
                        if (ack !== undefined)
                            resolve(ack);
                        else {
                            if (times < 1) {
                                reject(new Error("Timeout"));
                                return;
                            }
                            check();
                        }
                    }, 500);
                    times -= 1;
                };
                check();
            });
        });
    }
}
exports.default = RabbitMqCommandChain;
