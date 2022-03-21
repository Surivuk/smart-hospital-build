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
exports.queue = exports.channel = exports.connect = void 0;
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
function connect(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            callback_api_1.default.connect(url, function (error, connection) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(connection);
            });
        });
    });
}
exports.connect = connect;
function channel(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            connection.createChannel(function (error, channel) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(channel);
            });
        });
    });
}
exports.channel = channel;
function queue(channel, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            channel.assertQueue(queue === undefined ? '' : queue, { exclusive: true }, function (error, q) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(q);
            });
        });
    });
}
exports.queue = queue;
