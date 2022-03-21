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
exports.ESMedicalCardRepositoryError = void 0;
const db_client_1 = require("@eventstore/db-client");
const MedicalCard_1 = __importDefault(require("../MedicalCard"));
class ESMedicalCardRepositoryError extends Error {
    constructor(message) {
        super(`[ESMedicalCardRepository] Error - ${message}`);
    }
}
exports.ESMedicalCardRepositoryError = ESMedicalCardRepositoryError;
class ESMedicalCardRepository {
    constructor(_client, _eventStore) {
        this._client = _client;
        this._eventStore = _eventStore;
    }
    medicalCard(id) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = this._client.readStream(this.streamName(id), { direction: db_client_1.FORWARDS, fromRevision: db_client_1.START });
                const medicalCard = new MedicalCard_1.default();
                const readEvents = [];
                try {
                    for (var events_1 = __asyncValues(events), events_1_1; events_1_1 = yield events_1.next(), !events_1_1.done;) {
                        const resolvedEvent = events_1_1.value;
                        if (!resolvedEvent.event)
                            continue;
                        readEvents.push(this._eventStore.event(resolvedEvent.event));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (events_1_1 && !events_1_1.done && (_a = events_1.return)) yield _a.call(events_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                medicalCard.loadsFromHistory(readEvents);
                return medicalCard;
            }
            catch (error) {
                throw new ESMedicalCardRepositoryError(`[medicalCard] = ${error.message}`);
            }
        });
    }
    save(medicalCard) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = medicalCard.uncommittedChanges().map(e => this._eventStore.eventData(e));
                yield this._client.appendToStream(this.streamName(medicalCard.id), events);
            }
            catch (error) {
                throw new ESMedicalCardRepositoryError(`[save] - ${error.message}`);
            }
        });
    }
    streamName(id) {
        return `medical-card-${id.toString()}`;
    }
}
exports.default = ESMedicalCardRepository;
