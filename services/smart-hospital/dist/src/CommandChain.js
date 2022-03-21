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
exports.TestCommandChain = void 0;
class TestCommandChain {
    constructor() {
        this._processors = new Map();
    }
    registerProcessor(commandName, processor) {
        if (this._processors.has(commandName))
            throw new Error(`Processor for "${commandName}" command is already registered`);
        this._processors.set(commandName, processor);
        return this;
    }
    process(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this._processors.get(command.constructor.name);
            if (handler === undefined)
                throw new Error(`No register processor for "${command.constructor.name}" command`);
            yield handler(command);
        });
    }
}
exports.TestCommandChain = TestCommandChain;
