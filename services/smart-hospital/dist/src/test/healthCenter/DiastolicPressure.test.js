"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DiastolicBloodPressure_1 = __importDefault(require("../../healthCenter/healthData/DiastolicBloodPressure"));
function pressure(value) {
    return new DiastolicBloodPressure_1.default(new Date().getTime(), value);
}
describe('DiastolicBloodPressure', () => {
    test('normal values', () => {
        expect(pressure(90).isNormal()).toBe(true);
    });
    test('warning values', () => {
        expect(pressure(91).isWarning()).toBe(true);
        expect(pressure(100).isWarning()).toBe(true);
    });
    test('critical values', () => {
        expect(pressure(111).isCritical()).toBe(true);
        expect(pressure(120).isCritical()).toBe(true);
    });
});
