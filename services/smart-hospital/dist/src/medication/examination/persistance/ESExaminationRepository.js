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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESExaminationRepositoryError = void 0;
class ESExaminationRepositoryError extends Error {
    constructor(message) {
        super(`[ESExaminationRepository] Error - ${message}`);
    }
}
exports.ESExaminationRepositoryError = ESExaminationRepositoryError;
class ESExaminationRepository {
    constructor(_client, _eventStore) {
        this._client = _client;
        this._eventStore = _eventStore;
    }
    save(examination) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._client.appendToStream(`examination-${examination.id.toString()}`, examination.uncommittedChanges().map(e => this._eventStore.eventData(e)));
            }
            catch (error) {
                throw new ESExaminationRepositoryError(`[save] - ${error.message}`);
            }
        });
    }
}
exports.default = ESExaminationRepository;
