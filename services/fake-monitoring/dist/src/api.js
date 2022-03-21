"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Device_1 = __importDefault(require("./Device"));
class WebApi {
    constructor(_mqtt, _devices) {
        this._mqtt = _mqtt;
        this._devices = _devices;
        this._app = (0, express_1.default)();
        this._server = http_1.default.createServer(this._app);
        this.io = new socket_io_1.Server(this._server);
    }
    start(port) {
        this.configureApp();
        this.configureSocket();
        this._server.listen(port, () => {
            console.log(`Listening on port ${port}...`);
        });
    }
    configureApp() {
        this._app.set("views", path_1.default.join(__dirname, "pages"))
            .use(express_1.default.static("./public"))
            .set("view engine", "ejs")
            .get("/", (req, res) => {
            res.render("index", { devices: this._devices, changes: Object.keys(Device_1.default.CHANGES) });
        });
    }
    configureSocket() {
        this.io.on("connection", (socket) => {
            // console.log(`[SOCKET] Connected ${socket.id}`)
            this._devices.forEach((device) => {
                socket.on(`${device}/command`, (data) => {
                    this._mqtt.publish(`monitoring/${device}/command`, data);
                });
            });
            // socket.on("disconnect", () => {
            // 	console.log(`[SOCKET] Disconnected ${socket.id}`);
            // });
        });
    }
}
exports.default = WebApi;
