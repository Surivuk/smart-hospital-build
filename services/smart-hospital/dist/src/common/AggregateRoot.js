"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
class AggregateRoot {
    constructor() {
        this._changes = [];
        this._revision = BigInt(0);
    }
    set revision(nextRevision) {
        if (nextRevision < this._revision)
            throw new Error(`Revision problem! Current: ${this._revision}, New: ${nextRevision}`);
        this._revision = nextRevision;
    }
    get revision() {
        return this._revision;
    }
    get id() {
        return this._id;
    }
    uncommittedChanges() {
        return this._changes.slice();
    }
    markChangesAsCommitted() {
        while (this._changes.length !== 0)
            this._changes.pop();
    }
    loadsFromHistory(history) {
        for (const e of history)
            this.applyChangeBase(e, false);
    }
    applyChange(event) {
        this.applyChangeBase(event, true);
    }
    applyChangeBase(event, isNew) {
        this.apply(event);
        if (isNew)
            this._changes.push(event);
    }
}
exports.AggregateRoot = AggregateRoot;
