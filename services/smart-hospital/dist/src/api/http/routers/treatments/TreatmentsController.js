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
const MedicationCommands_1 = require("../../../../commands/MedicationCommands");
const NotEmptyStringField_1 = __importDefault(require("../../../../common/fields/NotEmptyStringField"));
const Guid_1 = __importStar(require("../../../../common/Guid"));
class TreatmentsController {
    constructor(_commandChain, _query) {
        this._commandChain = _commandChain;
        this._query = _query;
    }
    openTreatment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { medicalCardId, diagnosis } = req.body;
            const id = Guid_1.GuidFactory.guid();
            yield this._commandChain.process(new MedicationCommands_1.OpenHospitalTreatment(Guid_1.default.create(medicalCardId), id, NotEmptyStringField_1.default.create(diagnosis)));
            res.header("Location", `/treatments/${id.toString()}`);
            res.sendStatus(201);
        });
    }
    closeTreatment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._commandChain.process(new MedicationCommands_1.CloseHospitalTreatment(Guid_1.default.create(req.params.id)));
            res.sendStatus(204);
        });
    }
    removeTherapy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { therapyId } = req.body;
            yield this._commandChain.process(new MedicationCommands_1.RemoveTherapyFromTreatment(Guid_1.default.create(therapyId), Guid_1.default.create(req.params.id)));
            res.sendStatus(204);
        });
    }
    treatment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield this._query.treatment(Guid_1.default.create(req.params.id)));
        });
    }
    treatments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.query.medicalCardId !== undefined)
                res.json(yield this._query.treatmentsForMedicalCard(Guid_1.default.create(req.query.medicalCardId)));
            else
                res.json(yield this._query.treatments());
        });
    }
}
exports.default = TreatmentsController;
