"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAllowedConsumptionRoute = void 0;
class NotAllowedConsumptionRoute extends Error {
}
exports.NotAllowedConsumptionRoute = NotAllowedConsumptionRoute;
class ConsumptionRoute {
    constructor(_route) {
        this._route = _route;
    }
    static create(route) {
        if (this.ALLOWED_ROUTES.find(allowed => route === allowed) === undefined)
            throw new NotAllowedConsumptionRoute(`Provided route - "${route}"`);
        return new ConsumptionRoute(route);
    }
    toString() {
        return this._route;
    }
}
exports.default = ConsumptionRoute;
ConsumptionRoute.ALLOWED_ROUTES = [
    "PO (by mouth)",
    "PR (per rectum)",
    "IM (intramuscular)",
    "IV (intravenous)",
    "ID (intradermal)",
    "IN (intranasal)",
    "TP (topical)",
    "SL (sublingual)",
    "BUCC (buccal)",
    "IP (intraperitoneal)",
];
