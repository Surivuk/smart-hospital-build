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
const db_client_1 = require("@eventstore/db-client");
const Therapy_1 = __importDefault(require("../Therapy"));
const StaticTherapy_1 = __importDefault(require("../StaticTherapy"));
class ESTherapyRepository {
    constructor(_client, _eventStore) {
        this._client = _client;
        this._eventStore = _eventStore;
    }
    therapy(therapyId) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const therapy = new Therapy_1.default();
            const loadedEvents = [];
            const events = this._client.readStream(this.streamName(therapyId), {
                direction: db_client_1.FORWARDS,
                fromRevision: db_client_1.START,
            });
            try {
                for (var events_1 = __asyncValues(events), events_1_1; events_1_1 = yield events_1.next(), !events_1_1.done;) {
                    const { event } = events_1_1.value;
                    if (event === undefined)
                        continue;
                    loadedEvents.push(this._eventStore.event(event));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (events_1_1 && !events_1_1.done && (_a = events_1.return)) yield _a.call(events_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            therapy.loadsFromHistory(loadedEvents);
            const type = loadedEvents[0].type;
            if (type.isStatic())
                return new StaticTherapy_1.default(therapy);
            return therapy;
        });
    }
    save(therapy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._client.appendToStream(this.streamName(therapy.id), this.uncommittedEvents(therapy));
        });
    }
    streamName(therapyId) {
        return `therapy-${therapyId.toString()}`;
    }
    uncommittedEvents(therapy) {
        return therapy.uncommittedChanges().map(event => this._eventStore.eventData(event));
    }
}
exports.default = ESTherapyRepository;
