"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
class HttpServer {
    constructor(config) {
        this._app = (0, express_1.default)();
        this._server = (0, http_1.createServer)(this._app);
        this._io = new socket_io_1.Server(this._server, {
            cors: {
                origin: config.smartHospitalUi,
                methods: ["GET", "POST"]
            }
        });
    }
    get io() {
        return this._io;
    }
    start(port) {
        this.bindRoutes(this._app
            .use(express_1.default.json())
            .use(express_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))
            .use((0, morgan_1.default)(function (tokens, req, res) {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms'
            ].join(' ');
        }))).use((err, req, res, next) => {
            console.error(`[HTTP API] [Error] -> ${err.message}`);
            res.status(500).send('Something broke!');
        });
        this._server.listen(port, () => console.log(`[HTTP API] Listening on port ${port} ...`));
    }
}
exports.default = HttpServer;
