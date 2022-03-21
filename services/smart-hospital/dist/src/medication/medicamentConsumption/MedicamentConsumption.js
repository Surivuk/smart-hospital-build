"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MedicamentConsumption {
    constructor(medicamentId, strength, amount, route, frequency) {
        this.medicamentId = medicamentId;
        this.strength = strength;
        this.amount = amount;
        this.route = route;
        this.frequency = frequency;
    }
}
exports.default = MedicamentConsumption;
