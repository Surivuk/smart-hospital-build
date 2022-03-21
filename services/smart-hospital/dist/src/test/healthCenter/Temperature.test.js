"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Temperature_1 = __importDefault(require("../../healthCenter/healthData/Temperature"));
function temperature(value) {
    return new Temperature_1.default(new Date().getTime(), value);
}
describe('Temperature', () => {
    test('normal values', () => {
        expect(temperature(36).isNormal()).toBe(true);
        expect(temperature(36.9).isNormal()).toBe(true);
    });
    test('warning values', () => {
        expect(temperature(37.1).isWarning()).toBe(true);
        expect(temperature(38.9).isWarning()).toBe(true);
        expect(temperature(35.9).isWarning()).toBe(true);
        expect(temperature(35.1).isWarning()).toBe(true);
    });
    test('critical values', () => {
        expect(temperature(39).isCritical()).toBe(true);
        expect(temperature(34.9).isCritical()).toBe(true);
    });
});
