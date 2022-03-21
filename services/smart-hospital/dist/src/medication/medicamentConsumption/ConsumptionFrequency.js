"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAllowedConsumptionFrequency = void 0;
class NotAllowedConsumptionFrequency extends Error {
}
exports.NotAllowedConsumptionFrequency = NotAllowedConsumptionFrequency;
class ConsumptionFrequency {
    constructor(_frequency) {
        this._frequency = _frequency;
    }
    static create(frequency) {
        if (this.ALLOWED_FREQUENCIES.find(allowed => frequency === allowed) === undefined)
            throw new NotAllowedConsumptionFrequency(`Provided frequency - "${frequency}"`);
        return new ConsumptionFrequency(frequency);
    }
    toString() {
        return this._frequency;
    }
}
exports.default = ConsumptionFrequency;
ConsumptionFrequency.ALLOWED_FREQUENCIES = [
    "daily",
    "every other day",
    "twice a day",
    "three times a day",
    "four times a day",
    "every bedtime",
    "every 4 hours",
    "every 4 to 6 hours",
    "every week",
];
