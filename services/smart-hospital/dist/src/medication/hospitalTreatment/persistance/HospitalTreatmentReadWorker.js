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
const KnexConnector_1 = __importDefault(require("../../../common/db/KnexConnector"));
const db_client_1 = require("@eventstore/db-client");
class HospitalTreatmentReadWorker extends KnexConnector_1.default {
    constructor(_client) {
        super();
        this._client = _client;
        this._groupName = "hospital-treatment";
    }
    work() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    // await this._client.deletePersistentSubscriptionToAll(this._groupName)
                    yield this._client.getPersistentSubscriptionToAllInfo(this._groupName);
                }
                catch (error) {
                    yield this._client.createPersistentSubscriptionToAll(this._groupName, Object.assign(Object.assign({}, (0, db_client_1.persistentSubscriptionToAllSettingsFromDefaults)()), { startFrom: db_client_1.START }), {
                        filter: (0, db_client_1.eventTypeFilter)({
                            prefixes: [
                                "hospital-treatment-created",
                                "therapy-added-to-treatment",
                                "therapy-removed-from-treatment",
                                "hospital-treatment-closed"
                            ]
                        })
                    });
                }
                const subscription = this._client.subscribeToPersistentSubscriptionToAll(this._groupName);
                try {
                    try {
                        for (var subscription_1 = __asyncValues(subscription), subscription_1_1; subscription_1_1 = yield subscription_1.next(), !subscription_1_1.done;) {
                            const event = subscription_1_1.value;
                            if (!event.event)
                                continue;
                            yield this.handleEvent(event.event);
                            yield subscription.ack(event);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (subscription_1_1 && !subscription_1_1.done && (_a = subscription_1.return)) yield _a.call(subscription_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                catch (error) {
                    console.log(`Subscription was dropped. ${error}`);
                }
            }
            catch (error) {
                console.log(`[HospitalTreatmentReadWorker] - ${error.message}`);
            }
        });
    }
    handleEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = event.streamId.split("hospital-treatment-")[1];
                if (event.type === "hospital-treatment-created")
                    yield this.treatmentCreated(id, event.data);
                if (event.type === "therapy-added-to-treatment")
                    yield this.therapyAdded(id, event.data);
                if (event.type === "therapy-removed-from-treatment")
                    yield this.therapyRemoved(id, event.data);
                if (event.type === "hospital-treatment-closed")
                    yield this.treatmentClosed(id, event.data);
            }
            catch (error) {
                console.log(`[READ WORKER] - [HospitalTreatmentReadWorker] - ${error.message}`);
            }
        });
    }
    treatmentCreated(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("medication.hospital_treatment").insert({ id: id, diagnosis: data.diagnosis, created_at: this.knex.fn.now() });
        });
    }
    therapyAdded(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let counter = 3;
            const action = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.knex("medication.hospital_treatment_therapies").insert({
                        therapy: data.therapyId,
                        hospital_treatment: id,
                        created_at: this.knex.fn.now()
                    });
                }
                catch (error) {
                    if (counter === 0)
                        return;
                    counter--;
                    setTimeout(() => action(), 1000);
                }
            });
            return action();
        });
    }
    therapyRemoved(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("medication.hospital_treatment_therapies").where({ therapy: data.therapyId, hospital_treatment: id }).delete();
        });
    }
    treatmentClosed(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("medication.hospital_treatment").update({ closed: true, closed_at: this.knex.fn.now() }).where({ id: id });
        });
    }
}
exports.default = HospitalTreatmentReadWorker;
