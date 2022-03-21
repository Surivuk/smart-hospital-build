"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class AlarmingRouter {
    constructor(_controller) {
        this._controller = _controller;
    }
    router() {
        return (0, express_1.Router)()
            .post("/", (0, express_async_handler_1.default)((req, res) => this._controller.createAlarm(req, res)))
            .get("/", (0, express_async_handler_1.default)((req, res) => this._controller.alarms(req, res)))
            .get("/:id", (0, express_async_handler_1.default)((req, res) => this._controller.alarm(req, res)))
            .get("/:id/notifications", (0, express_async_handler_1.default)((req, res) => this._controller.alarmNotifications(req, res)))
            .post("/:id/activate", (0, express_async_handler_1.default)((req, res) => this._controller.activateAlarm(req, res)))
            .post("/:id/deactivate", (0, express_async_handler_1.default)((req, res) => this._controller.deactivateAlarm(req, res)))
            .delete("/:id", (0, express_async_handler_1.default)((req, res) => this._controller.deleteAlarm(req, res)));
    }
}
exports.default = AlarmingRouter;
