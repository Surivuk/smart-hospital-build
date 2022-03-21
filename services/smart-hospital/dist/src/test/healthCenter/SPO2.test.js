"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SPO2_1 = __importDefault(require("../../healthCenter/healthData/SPO2"));
function spo2(value) {
    return new SPO2_1.default(new Date().getTime(), value);
}
describe('SPO2', () => {
    test('normal values', () => {
        expect(spo2(95).isNormal()).toBe(true);
        expect(spo2(99).isNormal()).toBe(true);
    });
    test('warning values', () => {
        expect(spo2(90).isWarning()).toBe(true);
        expect(spo2(94).isWarning()).toBe(true);
    });
    test('critical values', () => {
        expect(spo2(89).isCritical()).toBe(true);
        expect(spo2(75).isCritical()).toBe(true);
    });
});
