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
class TherapyReadWorker extends KnexConnector_1.default {
    constructor(_client) {
        super();
        this._client = _client;
        this._groupName = "therapy";
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
                                "therapy-created",
                                "medicament-added-to-therapy",
                                "medicament-removed-from-therapy",
                                "therapy-label-changed"
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
                console.log(`[TherapyReadWorker] - ${error.message}`);
            }
        });
    }
    handleEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = event.streamId.split("therapy-")[1];
                if (event.type === "therapy-created")
                    yield this.therapyCreated(id, event.data);
                if (event.type === "medicament-added-to-therapy")
                    yield this.medicamentAdded(id, event.data);
                if (event.type === "medicament-removed-from-therapy")
                    yield this.medicamentRemoved(id, event.data);
                if (event.type === "therapy-label-changed")
                    yield this.labelChanged(id, event.data);
            }
            catch (error) {
                console.log(`[READ WORKER] - [TherapyReadWorker] - ${error.message}`);
            }
        });
    }
    therapyCreated(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("medication.therapy").insert({ id: id, label: data.label, type: data.type, created_at: this.knex.fn.now() });
        });
    }
    medicamentAdded(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("medication.therapy_medicaments").insert({
                therapy: id,
                medicament_id: data.medicamentId,
                strength: data.strength,
                amount: data.amount,
                route: data.route,
                frequency: data.frequency,
                created_at: this.knex.fn.now()
            });
        });
    }
    medicamentRemoved(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("medication.therapy_medicaments").where({ therapy: id, medicament_id: data.medicamentId }).delete();
        });
    }
    labelChanged(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("medication.therapy").update({ label: data.label }).where({ id: id });
        });
    }
}
exports.default = TherapyReadWorker;
