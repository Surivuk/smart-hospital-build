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
const ConsumptionFrequency_1 = __importDefault(require("../../../../medication/medicamentConsumption/ConsumptionFrequency"));
const ConsumptionRoute_1 = __importDefault(require("../../../../medication/medicamentConsumption/ConsumptionRoute"));
const MedicamentConsumption_1 = __importDefault(require("../../../../medication/medicamentConsumption/MedicamentConsumption"));
class TherapiesController {
    constructor(_commandChain, _query) {
        this._commandChain = _commandChain;
        this._query = _query;
    }
    prescribeTherapy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { medicalCardId, medicaments } = req.body;
            const id = Guid_1.GuidFactory.guid();
            yield this._commandChain.process(new MedicationCommands_1.PrescribeTherapy(Guid_1.default.create(medicalCardId), id, medicaments.map(({ medicamentId, strength, amount, route, frequency }) => new MedicamentConsumption_1.default(Guid_1.default.create(medicamentId), strength, amount, ConsumptionRoute_1.default.create(route), ConsumptionFrequency_1.default.create(frequency)))));
            res.header("Location", `/therapies/${id.toString()}`);
            res.sendStatus(201);
        });
    }
    determineTherapy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hospitalTreatmentId, medicaments, label } = req.body;
            const id = Guid_1.GuidFactory.guid();
            yield this._commandChain.process(new MedicationCommands_1.DetermineTherapy(Guid_1.default.create(hospitalTreatmentId), id, NotEmptyStringField_1.default.create(label), medicaments.map(({ medicamentId, strength, amount, route, frequency }) => new MedicamentConsumption_1.default(Guid_1.default.create(medicamentId), strength, amount, ConsumptionRoute_1.default.create(route), ConsumptionFrequency_1.default.create(frequency)))));
            res.header("Location", `/therapies/${id.toString()}`);
            res.sendStatus(201);
        });
    }
    addMedicamentToTherapy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { medicament } = req.body;
            yield this._commandChain.process(new MedicationCommands_1.AddMedicamentToTherapy(Guid_1.default.create(req.params.id), new MedicamentConsumption_1.default(Guid_1.default.create(medicament.medicamentId), medicament.strength, medicament.amount, ConsumptionRoute_1.default.create(medicament.route), ConsumptionFrequency_1.default.create(medicament.frequency))));
            res.sendStatus(204);
        });
    }
    removeMedicamentToTherapy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { medicamentId } = req.body;
            yield this._commandChain.process(new MedicationCommands_1.RemoveMedicamentFromTherapy(Guid_1.default.create(req.params.id), Guid_1.default.create(medicamentId)));
            res.sendStatus(204);
        });
    }
    changeTherapyLabel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { label } = req.body;
            yield this._commandChain.process(new MedicationCommands_1.ChangeTherapyLabel(Guid_1.default.create(req.params.id), NotEmptyStringField_1.default.create(label)));
            res.sendStatus(204);
        });
    }
    therapy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield this._query.therapy(new Guid_1.default(req.params.id)));
        });
    }
    therapies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield this._query.therapies());
        });
    }
    therapiesForTreatmentUntil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { treatmentId, date } = req.query;
            res.json(yield this._query.therapiesForTreatmentUntil(Guid_1.default.create(treatmentId), new Date(date)));
        });
    }
}
exports.default = TherapiesController;
