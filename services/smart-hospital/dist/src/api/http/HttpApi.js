"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsController_1 = __importDefault(require("../../api/http/routers/doctors/DoctorsController"));
const HttpServer_1 = __importDefault(require("../../common/http/HttpServer"));
const cors_1 = __importDefault(require("cors"));
const AlarmingController_1 = __importDefault(require("./routers/alarming/AlarmingController"));
const AlarmingRouter_1 = __importDefault(require("./routers/alarming/AlarmingRouter"));
const DoctorRouter_1 = __importDefault(require("./routers/doctors/DoctorRouter"));
const ExaminationsController_1 = __importDefault(require("./routers/examination/ExaminationsController"));
const ExaminationsRouter_1 = __importDefault(require("./routers/examination/ExaminationsRouter"));
const HealthCenterController_1 = __importDefault(require("./routers/healthCenter/HealthCenterController"));
const HealthCenterRouter_1 = __importDefault(require("./routers/healthCenter/HealthCenterRouter"));
const MedicalCardsController_1 = __importDefault(require("./routers/medicalCards/MedicalCardsController"));
const MedicalCardsRouter_1 = __importDefault(require("./routers/medicalCards/MedicalCardsRouter"));
const MedicamentsController_1 = __importDefault(require("./routers/medicaments/MedicamentsController"));
const MedicamentsRouter_1 = __importDefault(require("./routers/medicaments/MedicamentsRouter"));
const MonitoringController_1 = __importDefault(require("./routers/monitoring/MonitoringController"));
const MonitoringRouter_1 = __importDefault(require("./routers/monitoring/MonitoringRouter"));
const PatientsController_1 = __importDefault(require("./routers/patients/PatientsController"));
const PatientsRouter_1 = __importDefault(require("./routers/patients/PatientsRouter"));
const TherapiesController_1 = __importDefault(require("./routers/therapy/TherapiesController"));
const TherapiesRouter_1 = __importDefault(require("./routers/therapy/TherapiesRouter"));
const TreatmentsController_1 = __importDefault(require("./routers/treatments/TreatmentsController"));
const TreatmentsRouter_1 = __importDefault(require("./routers/treatments/TreatmentsRouter"));
class HttpApi extends HttpServer_1.default {
    constructor(_dependency, config) {
        super(config);
        this._dependency = _dependency;
    }
    bindRoutes(app) {
        return app
            .use((0, cors_1.default)())
            .use("/patients", new PatientsRouter_1.default(new PatientsController_1.default(this._dependency.commandChain, this._dependency.patientQueryService)).router())
            .use("/doctors", new DoctorRouter_1.default(new DoctorsController_1.default(this._dependency.doctorQueryService)).router())
            .use("/medicaments", new MedicamentsRouter_1.default(new MedicamentsController_1.default(this._dependency.medicamentQueryService)).router())
            .use("/medical-cards", new MedicalCardsRouter_1.default(new MedicalCardsController_1.default(this._dependency.medicalCardQueryService)).router())
            .use("/examinations", new ExaminationsRouter_1.default(new ExaminationsController_1.default(this._dependency.commandChain, this._dependency.examinationQueryService)).router())
            .use("/therapies", new TherapiesRouter_1.default(new TherapiesController_1.default(this._dependency.commandChain, this._dependency.therapyQueryService)).router())
            .use("/hospital-treatments", new TreatmentsRouter_1.default(new TreatmentsController_1.default(this._dependency.commandChain, this._dependency.hospitalTreatmentQueryService)).router())
            .use("/health-center", new HealthCenterRouter_1.default(new HealthCenterController_1.default(this._dependency.healthDataQueryService)).router())
            .use("/alarming", new AlarmingRouter_1.default(new AlarmingController_1.default(this._dependency.alarmQueryService, this._dependency.alarmNotificationQueryService, this._dependency.commandChain)).router())
            .use("/monitoring", new MonitoringRouter_1.default(new MonitoringController_1.default(this._dependency.monitoringQueryService)).router());
    }
}
exports.default = HttpApi;
