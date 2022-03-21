"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SPO2Monitor {
    isValueInRange(value) {
        const numValue = parseInt(value);
        if (isNaN(numValue))
            return false;
        return numValue >= 0 && numValue <= 100;
    }
}
exports.default = SPO2Monitor;
