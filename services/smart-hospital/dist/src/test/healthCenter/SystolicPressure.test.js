"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SystolicBloodPressure_1 = __importDefault(require("../../healthCenter/healthData/SystolicBloodPressure"));
function pressure(value) {
    return new SystolicBloodPressure_1.default(new Date().getTime(), value);
}
describe('SystolicBloodPressure', () => {
    test('normal values', () => {
        expect(pressure(120).isNormal()).toBe(true);
        expect(pressure(140).isNormal()).toBe(true);
    });
    test('warning values', () => {
        expect(pressure(141).isWarning()).toBe(true);
        expect(pressure(160).isWarning()).toBe(true);
    });
    test('critical values', () => {
        expect(pressure(161).isCritical()).toBe(true);
        expect(pressure(180).isCritical()).toBe(true);
    });
});
