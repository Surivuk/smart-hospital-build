"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Gender_1 = __importDefault(require("../../../../adminstration/Gender"));
const Name_1 = __importDefault(require("../../../../adminstration/Name"));
const AdministrationCommands_1 = __importDefault(require("../../../../commands/AdministrationCommands"));
const NormalNumberField_1 = __importDefault(require("../../../../common/fields/NormalNumberField"));
const Guid_1 = __importStar(require("../../../../common/Guid"));
class PatientsController {
    constructor(_commandChain, _patientsQueryServer) {
        this._commandChain = _commandChain;
        this._patientsQueryServer = _patientsQueryServer;
    }
    patients(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield this._patientsQueryServer.patients());
        });
    }
    patient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield this._patientsQueryServer.patient(Guid_1.default.create(req.params.id)));
        });
    }
    addPatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, gender, birthYear } = req.body;
            const id = Guid_1.GuidFactory.guid();
            yield this._commandChain.process(new AdministrationCommands_1.default(id, Name_1.default.create(firstName, lastName), Gender_1.default.create(gender), NormalNumberField_1.default.create(birthYear)));
            res.header("Location", `/medical-cards/${id.toString()}`);
            res.sendStatus(201);
        });
    }
}
exports.default = PatientsController;
