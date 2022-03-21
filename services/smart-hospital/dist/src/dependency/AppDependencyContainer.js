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
const AdminstrationProcessor_1 = __importDefault(require("../adminstration/AdminstrationProcessor"));
const DBMedicamentQueryService_1 = __importDefault(require("../medication/medicaments/persistance/DBMedicamentQueryService"));
const DBPatientQueryService_1 = __importDefault(require("../adminstration/patient/DBPatientQueryService"));
const DBPatientRepository_1 = __importDefault(require("../adminstration/patient/DBPatientRepository"));
const DBAlarmNotificationQueryService_1 = __importDefault(require("../alarming/persistance/DBAlarmNotificationQueryService"));
const AlarmingEventHandlers_1 = __importDefault(require("../alarming/AlarmingEventHandlers"));
const AlarmingProcessor_1 = __importDefault(require("../alarming/AlarmingProcessor"));
const DBAlarmNotificationRepository_1 = __importDefault(require("../alarming/persistance/DBAlarmNotificationRepository"));
const DBAlarmQueryService_1 = __importDefault(require("../alarming/persistance/DBAlarmQueryService"));
const DBAlarmRepository_1 = __importDefault(require("../alarming/persistance/DBAlarmRepository"));
const MemoryAlarmRepository_1 = __importDefault(require("../alarming/persistance/MemoryAlarmRepository"));
const HttpApi_1 = __importDefault(require("../api/http/HttpApi"));
const MqttApi_1 = __importDefault(require("../api/mqtt/MqttApi"));
const NotificationEventHandlers_1 = __importDefault(require("../notification/NotificationEventHandlers"));
const NotificationProcessor_1 = __importDefault(require("../notification/NotificationProcessor"));
const MqttConnection_1 = __importDefault(require("../common/mqtt/MqttConnection"));
const CommandAdapter_1 = __importDefault(require("../common/rabbitMq/CommandAdapter"));
const DomainEventAdapters_1 = __importDefault(require("../common/rabbitMq/DomainEventAdapters"));
const rabbitMq_1 = require("../common/rabbitMq/rabbitMq");
const RabbitMqCommandChain_1 = __importDefault(require("../common/rabbitMq/RabbitMqCommandChain"));
const RabbitMqEventBus_1 = __importDefault(require("../common/rabbitMq/RabbitMqEventBus"));
const AppSocket_1 = __importDefault(require("../common/webSocket/AppSocket"));
const db_client_1 = require("@eventstore/db-client");
const HealthCenterEventHandlers_1 = __importDefault(require("../healthCenter/HealthCenterEventHandlers"));
const DiastolicBloodPressure_1 = __importDefault(require("../healthCenter/healthData/DiastolicBloodPressure"));
const PI_1 = __importDefault(require("../healthCenter/healthData/PI"));
const Pulse_1 = __importDefault(require("../healthCenter/healthData/Pulse"));
const SPO2_1 = __importDefault(require("../healthCenter/healthData/SPO2"));
const SystolicBloodPressure_1 = __importDefault(require("../healthCenter/healthData/SystolicBloodPressure"));
const Temperature_1 = __importDefault(require("../healthCenter/healthData/Temperature"));
const HealthStorage_1 = __importDefault(require("../healthCenter/HealthStorage"));
const DBHealthDataQueryService_1 = __importDefault(require("../healthCenter/persistance/DBHealthDataQueryService"));
const DBHealthDataRepository_1 = __importDefault(require("../healthCenter/persistance/DBHealthDataRepository"));
const DBExaminationQueryService_1 = __importDefault(require("../medication/examination/persistance/DBExaminationQueryService"));
const ESExaminationRepository_1 = __importDefault(require("../medication/examination/persistance/ESExaminationRepository"));
const ExaminationEventStore_1 = require("../medication/examination/persistance/ExaminationEventStore");
const ExaminationReadWorker_1 = __importDefault(require("../medication/examination/persistance/ExaminationReadWorker"));
const DBHospitalTreatmentQueryService_1 = __importDefault(require("../medication/hospitalTreatment/persistance/DBHospitalTreatmentQueryService"));
const ESHospitalTreatmentRepository_1 = __importDefault(require("../medication/hospitalTreatment/persistance/ESHospitalTreatmentRepository"));
const HospitalTreatmentEventStore_1 = require("../medication/hospitalTreatment/persistance/HospitalTreatmentEventStore");
const HospitalTreatmentReadWorker_1 = __importDefault(require("../medication/hospitalTreatment/persistance/HospitalTreatmentReadWorker"));
const DBMedicalCardQueryService_1 = __importDefault(require("../medication/medicalCard/persistance/DBMedicalCardQueryService"));
const ESMedicalCardRepository_1 = __importDefault(require("../medication/medicalCard/persistance/ESMedicalCardRepository"));
const MedicalCardEventStore_1 = require("../medication/medicalCard/persistance/MedicalCardEventStore");
const MedicalCardReadWorker_1 = __importDefault(require("../medication/medicalCard/persistance/MedicalCardReadWorker"));
const MedicationEventHandlers_1 = __importDefault(require("../medication/MedicationEventHandlers"));
const MedicationProcessor_1 = __importDefault(require("../medication/MedicationProcessor"));
const DBTherapyQueryService_1 = __importDefault(require("../medication/therapy/persistance/DBTherapyQueryService"));
const ESTherapyRepository_1 = __importDefault(require("../medication/therapy/persistance/ESTherapyRepository"));
const TherapyEventStore_1 = require("../medication/therapy/persistance/TherapyEventStore");
const TherapyReadWorker_1 = __importDefault(require("../medication/therapy/persistance/TherapyReadWorker"));
const MonitoringEventHandlers_1 = __importDefault(require("../monitoring/MonitoringEventHandlers"));
const MonitoringProcessor_1 = __importDefault(require("../monitoring/MonitoringProcessor"));
const DBMonitoringRepository_1 = __importDefault(require("../monitoring/persistance/DBMonitoringRepository"));
const DBDoctorQueryService_1 = __importDefault(require("../adminstration/doctor/DBDoctorQueryService"));
const DBMonitoringQueryService_1 = __importDefault(require("../monitoring/persistance/DBMonitoringQueryService"));
class AppDependencyContainer {
    constructor(_config) {
        this._config = _config;
        // ReadWorkers
        this._readWorkers = [];
    }
    createDependency() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createChannels();
            const client = db_client_1.EventStoreDBClient.connectionString(this._config.eventStore);
            this._dependency = {
                mqtt: this._mqtt,
                commandChain: this._commandChain,
                eventBus: this._eventBus,
                // QueryServices
                patientQueryService: new DBPatientQueryService_1.default(),
                doctorQueryService: new DBDoctorQueryService_1.default(),
                medicalCardQueryService: new DBMedicalCardQueryService_1.default(),
                healthDataQueryService: new DBHealthDataQueryService_1.default(),
                alarmQueryService: new DBAlarmQueryService_1.default(),
                therapyQueryService: new DBTherapyQueryService_1.default(),
                hospitalTreatmentQueryService: new DBHospitalTreatmentQueryService_1.default(),
                alarmNotificationQueryService: new DBAlarmNotificationQueryService_1.default(),
                examinationQueryService: new DBExaminationQueryService_1.default(),
                medicamentQueryService: new DBMedicamentQueryService_1.default(),
                monitoringQueryService: new DBMonitoringQueryService_1.default()
            };
            this._httpServer = new HttpApi_1.default(this._dependency, this._config);
            this._webSocket = new AppSocket_1.default(this._httpServer.io);
            // Repositories
            const patientRepository = new DBPatientRepository_1.default();
            const medicalCardRepository = new ESMedicalCardRepository_1.default(client, new MedicalCardEventStore_1.MedicalCardEventStore());
            const examinationRepository = new ESExaminationRepository_1.default(client, new ExaminationEventStore_1.ExaminationEventStore());
            const therapyRepository = new ESTherapyRepository_1.default(client, new TherapyEventStore_1.TherapyEventStore());
            const treatmentRepository = new ESHospitalTreatmentRepository_1.default(client, new HospitalTreatmentEventStore_1.HospitalTreatmentEventStore());
            const monitoringRepository = new DBMonitoringRepository_1.default();
            const healthDataRepository = new DBHealthDataRepository_1.default();
            const alarmRepository = new MemoryAlarmRepository_1.default(new DBAlarmRepository_1.default());
            const alarmNotificationRepository = new DBAlarmNotificationRepository_1.default();
            // Processors
            this._adminstrationProcessor = new AdminstrationProcessor_1.default(patientRepository, this._eventBus);
            this._medicationProcessor = new MedicationProcessor_1.default(medicalCardRepository, examinationRepository, therapyRepository, treatmentRepository, this._eventBus);
            this._monitoringProcessor = new MonitoringProcessor_1.default(monitoringRepository, this._eventBus);
            this._alarmingProcessor = new AlarmingProcessor_1.default(this._eventBus, alarmRepository);
            this._notificationProcessor = new NotificationProcessor_1.default();
            // EventHandlers
            this._medicationEventHandler = new MedicationEventHandlers_1.default(medicalCardRepository);
            this._monitoringEventHandlers = new MonitoringEventHandlers_1.default(monitoringRepository);
            this._healthDataEventHandlers = new HealthCenterEventHandlers_1.default(new HealthStorage_1.default(healthDataRepository, {
                SPO2: (timestamp, value) => new SPO2_1.default(timestamp, parseInt(value)),
                "systolic-blood-pressure": (timestamp, value) => new SystolicBloodPressure_1.default(timestamp, parseInt(value)),
                "diastolic-blood-pressure": (timestamp, value) => new DiastolicBloodPressure_1.default(timestamp, parseInt(value)),
                PI: (timestamp, value) => new PI_1.default(timestamp, parseFloat(value)),
                pulse: (timestamp, value) => new Pulse_1.default(timestamp, parseInt(value)),
                temperature: (timestamp, value) => new Temperature_1.default(timestamp, parseFloat(value)),
            }));
            this._alarmingEventHandlers = new AlarmingEventHandlers_1.default(alarmRepository, alarmNotificationRepository);
            this._notificationEventHandlers = new NotificationEventHandlers_1.default(this._webSocket, this._dependency.alarmQueryService, this._dependency.hospitalTreatmentQueryService);
            // ReadWorkers
            this._readWorkers.push(new MedicalCardReadWorker_1.default(client));
            this._readWorkers.push(new HospitalTreatmentReadWorker_1.default(client));
            this._readWorkers.push(new TherapyReadWorker_1.default(client));
            this._readWorkers.push(new ExaminationReadWorker_1.default(client));
            return this;
        });
    }
    createChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._mqtt = new MqttConnection_1.default(this._config.mqtt);
            }
            catch (error) {
                console.log("MQTT");
                throw error;
            }
            try {
                const connection = yield (0, rabbitMq_1.connect)(this._config.rabbitMq);
                const serverChannel = yield (0, rabbitMq_1.channel)(connection);
                const clientChannel = yield (0, rabbitMq_1.channel)(connection);
                this._commandChain = new RabbitMqCommandChain_1.default(serverChannel, clientChannel, new CommandAdapter_1.default());
                this._eventBus = new RabbitMqEventBus_1.default(clientChannel, new DomainEventAdapters_1.default());
                yield this._commandChain.start();
                yield this._eventBus.start();
            }
            catch (error) {
                console.log("RABBIT");
                throw error;
            }
        });
    }
    registerProcesses() {
        [
            this._adminstrationProcessor,
            this._medicationProcessor,
            this._monitoringProcessor,
            this._alarmingProcessor,
            this._notificationProcessor
        ].forEach(processor => processor.registerProcesses(this._commandChain));
        return this;
    }
    registerHandlers() {
        [
            this._medicationEventHandler,
            this._monitoringEventHandlers,
            this._healthDataEventHandlers,
            this._alarmingEventHandlers,
            this._notificationEventHandlers
        ].forEach(handler => handler.registerHandlers(this._eventBus));
        return this;
    }
    startHttpApi() {
        this._httpServer.start(this._config.port);
        return this;
    }
    startReadWorkers() {
        this._readWorkers.forEach(worker => worker.work());
        return this;
    }
    startMqttApi() {
        new MqttApi_1.default(this._dependency).start();
        return this;
    }
}
exports.default = AppDependencyContainer;
