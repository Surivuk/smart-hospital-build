"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./api"));
const MqttConnection_1 = __importDefault(require("./MqttConnection"));
const fs_1 = __importDefault(require("fs"));
const Device_1 = __importDefault(require("./Device"));
function main() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { devices } = JSON.parse(fs_1.default.readFileSync("./settings.json").toString());
        const deviceMap = new Map();
        const mqtt = new MqttConnection_1.default(process.env.MQTT_URL);
        const api = new api_1.default(mqtt, devices);
        const publish = (topic, data) => { mqtt.publish(topic, data); };
        try {
            for (var devices_1 = __asyncValues(devices), devices_1_1; devices_1_1 = yield devices_1.next(), !devices_1_1.done;) {
                const device = devices_1_1.value;
                yield mqtt.subscribe(`monitoring/${device}/command`);
                yield mqtt.subscribe(`monitoring/${device}/data`);
                yield mqtt.subscribe(`monitoring/${device}/status`);
                deviceMap.set(device, new Device_1.default(device, publish));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (devices_1_1 && !devices_1_1.done && (_a = devices_1.return)) yield _a.call(devices_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log(process.env.HTTP_PORT);
        api.start(parseInt(process.env.HTTP_PORT));
        mqtt.start((topic, data) => __awaiter(this, void 0, void 0, function* () {
            const device = topic.split('/')[1];
            handleCommand(deviceMap.get(device), data);
            if (topic.endsWith("/data"))
                api.io.emit(`${device}/data`, data);
            if (topic.endsWith("/status"))
                api.io.emit(`${device}/status`, data);
        }));
    });
}
function handleCommand(device, { command }) {
    if (command === undefined)
        return;
    if (device === undefined)
        return;
    if (command === "start")
        device.start();
    if (command === "stop")
        device.stop();
    if (command === "info")
        device.info();
    if (command.startsWith("report-every"))
        device.changeReportTime(parseInt(command.split("-")[2]));
    const allowed = Object.keys(Device_1.default.CHANGES);
    if (allowed.indexOf(command) !== -1)
        device.changeProfile(command);
}
main().catch(error => { console.log(`[APP] ${error.message}`); });
