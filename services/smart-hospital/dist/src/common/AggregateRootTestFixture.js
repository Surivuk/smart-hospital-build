"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateRootTestFixture = void 0;
function aggregateRootTestFixture({ root: createRoot, given, when }) {
    let error;
    const root = createRoot();
    root.loadsFromHistory(given());
    try {
        when(root);
    }
    catch (err) {
        error = err;
    }
    return { events: Array.from(root.uncommittedChanges()), error };
}
exports.aggregateRootTestFixture = aggregateRootTestFixture;
