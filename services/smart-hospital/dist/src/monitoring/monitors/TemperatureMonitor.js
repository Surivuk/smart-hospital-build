"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TemperatureMonitor {
    isValueInRange(value) {
        const numValue = parseInt(value);
        if (isNaN(numValue))
            return false;
        return numValue >= 30 && numValue <= 45;
    }
}
exports.default = TemperatureMonitor;
