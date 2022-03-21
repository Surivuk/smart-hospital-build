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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMonitoringRepositoryError = void 0;
const KnexConnector_1 = __importDefault(require("../../common/db/KnexConnector"));
const Guid_1 = __importDefault(require("../../common/Guid"));
const Monitoring_1 = __importDefault(require("../Monitoring"));
const DiastolicBloodPressureMonitor_1 = __importDefault(require("../monitors/DiastolicBloodPressureMonitor"));
const PIMonitor_1 = __importDefault(require("../monitors/PIMonitor"));
const PulseMonitor_1 = __importDefault(require("../monitors/PulseMonitor"));
const SPO2Monitor_1 = __importDefault(require("../monitors/SPO2Monitor"));
const SystolicBloodPressureMonitor_1 = __importDefault(require("../monitors/SystolicBloodPressureMonitor"));
const TemperatureMonitor_1 = __importDefault(require("../monitors/TemperatureMonitor"));
class DBMonitoringRepositoryError extends Error {
    constructor(message) {
        super(`[DBMonitoringRepository] Error - ${message}`);
    }
}
exports.DBMonitoringRepositoryError = DBMonitoringRepositoryError;
class DBMonitoringRepository extends KnexConnector_1.default {
    constructor() {
        super(...arguments);
        this._table = "monitoring.monitoring_device";
    }
    monitoring(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex(this._table).where({ id: id.toString() }).whereNot({ hospital_treatment: null });
                if (rows.length === 0)
                    throw new Error(`Not found monitoring device for provided id. Id: "${id.toString()}"`);
                return this.toMonitoring(rows[0]);
            }
            catch (error) {
                throw new DBMonitoringRepositoryError(`[monitoring] - ${error.message}`);
            }
        });
    }
    connectToFirstAvailableMonitoring(hospitalTreatmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.knex(this._table).where({ hospital_treatment: null }).limit(1);
                if (rows.length === 0)
                    throw new Error(`No free monitoring devices`);
                yield this.knex(this._table)
                    .update({ hospital_treatment: hospitalTreatmentId.toString(), modified_at: this.knex.fn.now() })
                    .where({ id: rows[0].id });
            }
            catch (error) {
                throw new DBMonitoringRepositoryError(`[connectToFirstAvailableDevice] - ${error.message}`);
            }
        });
    }
    disconnectTreatmentFormMonitoring(hospitalTreatmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.knex(this._table).update({
                    hospital_treatment: null,
                    modified_at: this.knex.fn.now()
                }).where({ hospital_treatment: hospitalTreatmentId.toString() });
            }
            catch (error) {
                throw new DBMonitoringRepositoryError(`[disconnectTreatmentFormMonitoring] - ${error.message}`);
            }
        });
    }
    toMonitoring(data) {
        return new Monitoring_1.default(new Guid_1.default(data.id), new Guid_1.default(data.hospital_treatment), {
            "SPO2": new SPO2Monitor_1.default(),
            "systolic-blood-pressure": new SystolicBloodPressureMonitor_1.default(),
            "diastolic-blood-pressure": new DiastolicBloodPressureMonitor_1.default(),
            PI: new PIMonitor_1.default(),
            temperature: new TemperatureMonitor_1.default(),
            pulse: new PulseMonitor_1.default()
        });
    }
}
exports.default = DBMonitoringRepository;
