"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class TreatmentsRouter {
    constructor(_controller) {
        this._controller = _controller;
    }
    router() {
        return (0, express_1.Router)()
            .get("/", (0, express_async_handler_1.default)((req, res) => this._controller.treatments(req, res)))
            .get("/:id", (0, express_async_handler_1.default)((req, res) => this._controller.treatment(req, res)))
            .post("/", (0, express_async_handler_1.default)((req, res) => this._controller.openTreatment(req, res)))
            .post("/:id/remove-therapy", (0, express_async_handler_1.default)((req, res) => this._controller.removeTherapy(req, res)))
            .post("/:id/close", (0, express_async_handler_1.default)((req, res) => this._controller.closeTreatment(req, res)));
    }
}
exports.default = TreatmentsRouter;
