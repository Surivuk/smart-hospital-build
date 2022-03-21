"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class HealthCenterRouter {
    constructor(_controller) {
        this._controller = _controller;
    }
    router() {
        return (0, express_1.Router)()
            .get("/:id", (0, express_async_handler_1.default)((req, res) => this._controller.healthDataPerDate(req, res)));
    }
}
exports.default = HealthCenterRouter;
