"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PIMonitor {
    isValueInRange(value) {
        const numValue = parseInt(value);
        if (isNaN(numValue))
            return false;
        return numValue >= 0 && numValue <= 30;
    }
}
exports.default = PIMonitor;
