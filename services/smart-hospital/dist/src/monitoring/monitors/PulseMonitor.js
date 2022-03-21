"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PulseMonitor {
    isValueInRange(value) {
        const numValue = parseInt(value);
        if (isNaN(numValue))
            return false;
        return numValue >= 0 && numValue <= 200;
    }
}
exports.default = PulseMonitor;
