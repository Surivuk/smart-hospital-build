"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystolicBloodPressureMonitor {
    isValueInRange(value) {
        const numValue = parseInt(value);
        if (isNaN(numValue))
            return false;
        return numValue >= 50 && numValue <= 250;
    }
}
exports.default = SystolicBloodPressureMonitor;
