"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HealthData {
    isInSameCategoryAs(data) {
        return this.isNormal() && data.isNormal() ||
            this.isWarning() && data.isWarning() ||
            this.isCritical() && data.isCritical();
    }
    hasSameTimestampAs(data) {
        return this.timestamp() === data.timestamp();
    }
    equals(data) {
        return this.type() === data.type() &&
            this.timestamp() === data.timestamp() &&
            this.value() === data.value();
    }
}
exports.default = HealthData;
