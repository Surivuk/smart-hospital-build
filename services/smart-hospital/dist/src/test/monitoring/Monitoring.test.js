"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Monitoring_1 = __importDefault(require("../../monitoring/Monitoring"));
const Guid_1 = __importDefault(require("../../common/Guid"));
const TestMonitor_1 = require("./TestMonitor");
function processData(data) {
    new Monitoring_1.default(new Guid_1.default("device-xyz"), new Guid_1.default("hospital-treatment-abc"), { "test": new TestMonitor_1.TestMonitor() }).healthData(data);
}
describe('When data in range arrived', () => {
    test('should be no errors', () => {
        expect(() => processData((0, TestMonitor_1.testData)("test", "1"))).not.toThrowError();
    });
});
describe('When data out of range arrived', () => {
    test('should be an error', () => {
        expect(() => processData((0, TestMonitor_1.testData)("test", "0"))).toThrowError();
    });
});
describe('When data with unknown type arrived', () => {
    test('should be an error when', () => {
        expect(() => processData((0, TestMonitor_1.testData)("param-x", "10"))).toThrowError();
    });
});
