"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testData = exports.TestMonitor = void 0;
class TestMonitor {
    isValueInRange(value) {
        return value === "1";
    }
}
exports.TestMonitor = TestMonitor;
const testData = (type, value) => ({ type, timestamp: new Date().getTime(), value });
exports.testData = testData;
