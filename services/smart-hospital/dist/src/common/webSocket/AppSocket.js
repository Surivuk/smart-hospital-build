"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppSocket {
    constructor(_io) {
        this._io = _io;
    }
    sendMessage(topic, message) {
        this._io.emit(topic, JSON.stringify(message));
    }
}
exports.default = AppSocket;
