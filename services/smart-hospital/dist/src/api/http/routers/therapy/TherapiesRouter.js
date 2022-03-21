"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class TherapiesRouter {
    constructor(_controller) {
        this._controller = _controller;
    }
    router() {
        return (0, express_1.Router)()
            .get("/", (0, express_async_handler_1.default)((req, res) => this._controller.therapies(req, res)))
            .get("/until", (0, express_async_handler_1.default)((req, res) => this._controller.therapiesForTreatmentUntil(req, res)))
            .get("/:id", (0, express_async_handler_1.default)((req, res) => this._controller.therapy(req, res)))
            .post("/prescribe", (0, express_async_handler_1.default)((req, res) => this._controller.prescribeTherapy(req, res)))
            .post("/determine", (0, express_async_handler_1.default)((req, res) => this._controller.determineTherapy(req, res)))
            .post("/:id/add-medicament", (0, express_async_handler_1.default)((req, res) => this._controller.addMedicamentToTherapy(req, res)))
            .post("/:id/remove-medicament", (0, express_async_handler_1.default)((req, res) => this._controller.removeMedicamentToTherapy(req, res)))
            .post("/:id/change-label", (0, express_async_handler_1.default)((req, res) => this._controller.changeTherapyLabel(req, res)));
    }
}
exports.default = TherapiesRouter;
