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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Guid_1 = require("../../common/Guid");
const HealthData_1 = __importDefault(require("../../healthCenter/healthData/HealthData"));
const HealthStorage_1 = __importDefault(require("../../healthCenter/HealthStorage"));
const TREATMENT_ID = Guid_1.GuidFactory.guid();
const seconds = (amount) => 1000 * amount;
const minutes = (amount) => seconds(60) * amount;
class MockHealthDataRepository {
    constructor() {
        this.data = [];
    }
    save(treatmentId, healthData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = this.data.concat(healthData);
        });
    }
}
class DataA extends HealthData_1.default {
    constructor(_timestamp, value) {
        super();
        this._timestamp = _timestamp;
        this._value = parseInt(value);
    }
    type() { return "data_a"; }
    value() { return `${this._value}`; }
    timestamp() { return this._timestamp; }
    isNormal() { return this._value <= 10; }
    isWarning() { return this._value > 10 && this._value <= 20; }
    isCritical() { return this._value > 20; }
}
class DataB extends HealthData_1.default {
    constructor(_timestamp, value) {
        super();
        this._timestamp = _timestamp;
        this._value = parseInt(value);
    }
    type() { return "data_b"; }
    value() { return `${this._value}`; }
    timestamp() { return this._timestamp; }
    isNormal() { return this._value <= 10; }
    isWarning() { return this._value > 10 && this._value <= 20; }
    isCritical() { return this._value > 20; }
}
const createStorage = (repository) => {
    return new HealthStorage_1.default(repository, {
        "data_a": (timestamp, value) => new DataA(timestamp, value),
        "data_b": (timestamp, value) => new DataB(timestamp, value)
    });
};
const data = (type, value, timestamp) => ({ type, value, timestamp: timestamp !== undefined ? timestamp : new Date().getTime() });
describe('When healthStorage store a data in normal range', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "5"));
    }));
    test('should be only one record', () => {
        expect(repository.data.length).toBe(1);
    });
    test('should be only one record with type "data_a"', () => {
        expect(repository.data[0].type()).toBe("data_a");
    });
});
describe('When healthStorage received multiple data in normal range, in short period', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "5"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "6"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "7"));
    }));
    test('should store only one record', () => {
        expect(repository.data.length).toBe(1);
    });
    test('should store only first record', () => {
        expect(repository.data[0].type()).toBe("data_a");
        expect(repository.data[0].value()).toBe("5");
    });
});
describe('When healthStorage received data in different ranges', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "5"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "11"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "21"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "4"));
    }));
    test('should store four records', () => {
        expect(repository.data.length).toBe(4);
    });
    test('should store all records', () => {
        expect(repository.data[0].value()).toBe("5");
        expect(repository.data[1].value()).toBe("11");
        expect(repository.data[2].value()).toBe("21");
        expect(repository.data[3].value()).toBe("4");
    });
});
describe('When healthStorage received data with different type in normal range', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "5"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_b", "6"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "7"));
        yield storage.storeHealthData(TREATMENT_ID, data("data_b", "8"));
    }));
    test('should store two record', () => {
        expect(repository.data.length).toBe(2);
    });
    test('should store (TREATMENT_ID, data_a) first record', () => {
        expect(repository.data[0].type()).toBe("data_a");
        expect(repository.data[0].value()).toBe("5");
    });
    test('should store (TREATMENT_ID, data_b) first record', () => {
        expect(repository.data[1].type()).toBe("data_b");
        expect(repository.data[1].value()).toBe("6");
    });
});
describe('When healthStorage received data with same type and in normal range but different times', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "5", 0));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "6", seconds(60)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "7", seconds(61)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "8", seconds(120)));
    }));
    test('should store tree records', () => {
        expect(repository.data.length).toBe(3);
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("5");
        expect(repository.data[1].value()).toBe("6");
        expect(repository.data[2].value()).toBe("8");
    });
});
describe('When healthStorage received data with same type and in warning range but different times', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "15", 0));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "16", seconds(30)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "17", seconds(31)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "18", seconds(60)));
    }));
    test('should store tree records', () => {
        expect(repository.data.length).toBe(3);
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("15");
        expect(repository.data[1].value()).toBe("16");
        expect(repository.data[2].value()).toBe("18");
    });
});
describe('When healthStorage received data with same type and in critical range but different times', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "25", 0));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "26", seconds(10)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "27", seconds(11)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "28", seconds(20)));
    }));
    test('should store tree records', () => {
        expect(repository.data.length).toBe(3);
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("25");
        expect(repository.data[1].value()).toBe("26");
        expect(repository.data[2].value()).toBe("28");
    });
});
describe('When healthStorage received data with same type but in different ranges and times', () => {
    let repository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repository = new MockHealthDataRepository();
        let storage = createStorage(repository);
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "5", seconds(0)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "16", seconds(1)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "27", seconds(3)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "8", seconds(4)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "7", seconds(5)));
        yield storage.storeHealthData(TREATMENT_ID, data("data_a", "6", seconds(64)));
    }));
    test('should store five records', () => {
        expect(repository.data.length).toBe(5);
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("5");
        expect(repository.data[1].value()).toBe("16");
        expect(repository.data[2].value()).toBe("27");
        expect(repository.data[3].value()).toBe("8");
        expect(repository.data[4].value()).toBe("6");
    });
});
