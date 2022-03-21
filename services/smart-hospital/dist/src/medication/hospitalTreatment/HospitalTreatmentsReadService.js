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
Object.defineProperty(exports, "__esModule", { value: true });
const db_client_1 = require("@eventstore/db-client");
class HospitalTreatment {
    constructor(data) {
        this.treatmentId = data.treatmentId;
        this.therapies = data.therapies;
    }
}
class HospitalTreatmentsReadService {
    constructor() {
        this._handlers = new Map();
        this._handlers
            .set("hospital-treatment-created", (redis, { data }) => __awaiter(this, void 0, void 0, function* () {
            yield redis.hSet("hospital-treatments", data.treatmentId, JSON.stringify(new HospitalTreatment(Object.assign(Object.assign({}, data), { therapies: [] }))));
        }))
            .set("therapy-added-to-treatment", (redis, { data }) => __awaiter(this, void 0, void 0, function* () {
            yield this.changeTreatment(redis, data.treatmentId, (treatment) => __awaiter(this, void 0, void 0, function* () {
                treatment.therapies.push(data.therapyId);
                return treatment;
            }));
        }));
    }
    read(client, redis) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = client.subscribeToAll({
                fromPosition: db_client_1.START, filter: (0, db_client_1.streamNameFilter)({
                    prefixes: ["hospital-treatment-"],
                }),
            });
            try {
                for (var subscription_1 = __asyncValues(subscription), subscription_1_1; subscription_1_1 = yield subscription_1.next(), !subscription_1_1.done;) {
                    const { event } = subscription_1_1.value;
                    if (event === undefined)
                        continue;
                    const handler = this._handlers.get(event.type);
                    if (handler === undefined)
                        continue;
                    yield handler(redis, event);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (subscription_1_1 && !subscription_1_1.done && (_a = subscription_1.return)) yield _a.call(subscription_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    changeTreatment(redis, id, change) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataString = yield redis.hGet("hospital-treatments", id);
            if (dataString === undefined)
                return;
            yield redis.hSet("hospital-treatments", id, JSON.stringify(yield change(JSON.parse(dataString))));
        });
    }
}
exports.default = HospitalTreatmentsReadService;
