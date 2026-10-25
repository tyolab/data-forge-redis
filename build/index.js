"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromRedis = exports.RedisClient = exports.RedisDataFrame = void 0;
var data_forge_1 = require("data-forge");
var dataForge = require("data-forge");
var redis = require('redis');
var RedisDataFrame = /** @class */ (function (_super) {
    __extends(RedisDataFrame, _super);
    function RedisDataFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dateArray = new Array();
        return _this;
    }
    return RedisDataFrame;
}(data_forge_1.DataFrame));
exports.RedisDataFrame = RedisDataFrame;
var RedisClient = /** @class */ (function () {
    function RedisClient(options) {
        if (!RedisClient.instance || !RedisClient.instance.connected) {
            RedisClient.instance = redis.createClient(options);
            if (options && options.database) {
                this.select(options.database);
            }
        }
    }
    RedisClient.prototype.get_instance = function () {
        return RedisClient.instance;
    };
    // @ts-ignore
    RedisClient.prototype.promisify = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var args_array = __spreadArray([], args, true);
        var func = args_array.shift();
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            var cb = function (err, value) {
                if (err)
                    return reject(err);
                resolve((value));
            };
            args_array.push(cb);
            try {
                func.apply(RedisClient.instance, args_array);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    RedisClient.prototype.select = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.select, db)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisClient.prototype.flushdb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.flushdb)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisClient.prototype.del = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.del, key)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisClient.prototype.delall = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.keys, key)];
                    case 1:
                        keys = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < keys.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.del(keys[i])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        ++i;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    RedisClient.prototype.exists = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.exists, key)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, 1 == value];
                }
            });
        });
    };
    RedisClient.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.set, key, value)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RedisClient.prototype.hset = function (key, field, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.hset, key, field, value)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RedisClient.prototype.hget = function (key, field, fallbackValue) {
        return __awaiter(this, void 0, void 0, function () {
            var value, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.promisify(RedisClient.instance.hget, key, field)];
                    case 1:
                        value = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, fallbackValue];
                    case 3: return [2 /*return*/, value || fallbackValue];
                }
            });
        });
    };
    RedisClient.prototype.hgetall = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.hgetall, key)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, value];
                }
            });
        });
    };
    RedisClient.prototype.get = function (key, fallbackValue) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promisify(RedisClient.instance.get, key)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, value || fallbackValue];
                }
            });
        });
    };
    RedisClient.getDateStringArray = function (startDate, endDate) {
        var array = new Array();
        if (endDate < startDate)
            new Error("The from-date should be before the to-date");
        var fromDate = startDate.getDate();
        var fromYear = startDate.getFullYear();
        var fromMonth = startDate.getMonth() + 1;
        var toDate = endDate.getDate();
        var toYear = endDate.getFullYear();
        var toMonth = endDate.getMonth() + 1;
        for (var x = fromYear; x <= toYear; ++x) {
            var fromThisMonth = 1;
            var toThisMonth = 12;
            if (x == fromYear) {
                fromThisMonth = fromMonth;
            }
            if (x == toYear) {
                toThisMonth = toMonth;
            }
            for (var y = fromThisMonth; y <= toThisMonth; ++y) {
                var maxDate = 31;
                // The 30-day months are April, June, September and November. July (7) was in this
                // fall-through list, so every July the generated key array stopped at the 30th and
                // `<year>0731` was NEVER requested from redis -- silently, every year, for every
                // symbol. See src/index.ts for the full note.
                switch (y) {
                    case 2:
                        // just to make things simple; a 20xx0229 key simply will not exist in a
                        // non-leap year, and a missing key is skipped harmlessly
                        maxDate = 29;
                        break;
                    case 4: // April
                    case 6: // June
                    case 9: // September
                    case 11: // November
                        maxDate = 30;
                        break;
                    default:
                        // 1, 3, 5, 7 (July), 8, 10, 12 all have 31 days
                        break;
                }
                var fromThisDate = 1;
                var toThisDate = maxDate;
                if (y == fromMonth && x == fromYear) {
                    fromThisDate = fromDate;
                }
                if (y == toMonth && x == toYear) {
                    toThisDate = toDate;
                }
                for (var z = fromThisDate; z <= toThisDate; ++z) {
                    array.push('' + x + (y > 9 ? '' : '0') + y + (z > 9 ? '' : '0') + z);
                }
            }
        }
        return array;
    };
    RedisClient.prototype.loadByDateArray = function (symbol, dateStringArray, keyPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, columnNames, keyStr, i, field, tmpStr, row, obj, dataFrame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = new Array();
                        columnNames = new Array();
                        keyStr = (keyPrefix || '') + symbol;
                        columnNames.push('date');
                        columnNames.push('open');
                        columnNames.push('close');
                        columnNames.push('high');
                        columnNames.push('low');
                        columnNames.push('volume');
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < dateStringArray.length)) return [3 /*break*/, 4];
                        field = dateStringArray[i];
                        return [4 /*yield*/, this.hget(keyStr, field)];
                    case 2:
                        tmpStr = _a.sent();
                        row = new Array();
                        row.push(field);
                        if (tmpStr) {
                            try {
                                obj = JSON.parse(tmpStr);
                                row.push(obj.O);
                                row.push(obj.C);
                                row.push(obj.H);
                                row.push(obj.L);
                                row.push(obj.V);
                            }
                            catch (err) {
                                row.push("");
                                row.push("");
                                row.push("");
                                row.push("");
                                row.push("");
                            }
                        }
                        else {
                            row.push("");
                            row.push("");
                            row.push("");
                            row.push("");
                            row.push("");
                        }
                        rows.push(row);
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4:
                        dataFrame = new RedisDataFrame({
                            rows: rows,
                            columnNames: columnNames,
                        });
                        dataFrame.symbol = symbol;
                        dataFrame.keyPrefix = keyPrefix;
                        dataFrame.dateArray = dateStringArray;
                        return [2 /*return*/, dataFrame];
                }
            });
        });
    };
    RedisClient.prototype.update = function (oldDataFrame, toDate) {
        return __awaiter(this, void 0, void 0, function () {
            var fromDate, dataFrame, tempDataFrame, newDataFrame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromDate = new Date(oldDataFrame.toDate.getTime());
                        fromDate.setDate(fromDate.getDate() + 1);
                        return [4 /*yield*/, this.load(oldDataFrame.symbol, fromDate, toDate, oldDataFrame.keyPrefix, oldDataFrame.codeChangeKeyPrefix)];
                    case 1:
                        dataFrame = _a.sent();
                        tempDataFrame = oldDataFrame.merge(dataFrame);
                        newDataFrame = new RedisDataFrame({
                            columnNames: tempDataFrame.getColumnNames(),
                            rows: tempDataFrame.toRows(),
                        });
                        newDataFrame.dateArray = oldDataFrame.dateArray.concat(dataFrame.dateArray);
                        newDataFrame.symbol = oldDataFrame.symbol;
                        newDataFrame.fromDate = fromDate;
                        newDataFrame.toDate = toDate;
                        newDataFrame.keyPrefix = oldDataFrame.keyPrefix;
                        newDataFrame.codeChangeKeyPrefix = oldDataFrame.codeChangeKeyPrefix;
                        return [2 /*return*/, dataFrame];
                }
            });
        });
    };
    RedisClient.prototype.load = function (symbol, fromDate, toDate, keyPrefix, codeChangeKeyPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            var symbolDates, tomorrowDate, lastToDate, symbolChange, _loop_1, this_1, codeChangesArray, i, rows, columnNames, dateArray, x, symbolDate, dateStringArray, keyStr, i, field, tmpStr, row, obj, dataFrame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keyPrefix = keyPrefix || '';
                        symbolDates = [];
                        tomorrowDate = new Date();
                        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                        lastToDate = toDate;
                        if (!codeChangeKeyPrefix) return [3 /*break*/, 4];
                        symbolChange = symbol;
                        _loop_1 = function () {
                            var codeChangeKey, codeChanges, codeChange, thisDate;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        codeChangeKey = codeChangeKeyPrefix + symbolChange;
                                        return [4 /*yield*/, this_1.hgetall(codeChangeKey)];
                                    case 1:
                                        codeChanges = _b.sent();
                                        codeChangesArray = [];
                                        if (codeChanges)
                                            codeChangesArray = Object.keys(codeChanges).map(function (key) { return codeChanges[key]; });
                                        if (codeChangesArray.length > 0) {
                                            // we need to sort the ranges first
                                            // the code change with the older dates need to be put in the front
                                            codeChangesArray.sort(function (a, b) { return (a.from_date > b.from_date) ? 1 : -1; });
                                            // only one is valid becuase in any given period of a time, there is only one code per stock possible
                                            i = 0;
                                            for (; i < codeChangesArray.length; ++i) {
                                                codeChange = JSON.parse(codeChangesArray[i]);
                                                if (codeChange.from_date) {
                                                    if (typeof codeChange.from_date == 'string')
                                                        codeChange.from_date = new Date(codeChange.from_date);
                                                }
                                                else {
                                                    codeChange.from_date = fromDate;
                                                }
                                                if (!codeChange.to_date)
                                                    codeChange.to_date = tomorrowDate;
                                                // we only need to take the first one that is overlapped with the given range
                                                // the given start date and to_date is out of the code change range
                                                // if there is only one entry we assume it only has been changed once we will just use the previous code
                                                if (lastToDate < codeChange.to_date && lastToDate > codeChange.from_date) {
                                                    thisDate = (codeChange.from_date < fromDate) ? fromDate : codeChange.from_date;
                                                    symbolDates.unshift({ symbol: symbolChange, fromDate: thisDate, toDate: lastToDate });
                                                    if (lastToDate > codeChange.from_date) {
                                                        lastToDate = new Date(codeChange.from_date.getTime());
                                                        lastToDate.setDate(codeChange.from_date.getDate() - 1);
                                                    }
                                                    if (fromDate < codeChange.from_date)
                                                        symbolChange = codeChange.from;
                                                    else // don't need to go any further as the requested from date is ahead of the code change date
                                                        symbolChange = null;
                                                    break;
                                                }
                                                else if (codeChangesArray.length == 1) {
                                                    // if the code change is only for the company name, but the code is actually the same, so not to worry
                                                    if (codeChange.from === symbolChange) {
                                                        // The code is unchanged, so the remaining (pre-change) range
                                                        // still lives under this same code — load it. Without this
                                                        // unshift the history before from_date was silently dropped
                                                        // (and a non-overlapping record returned no data at all).
                                                        symbolDates.unshift({ symbol: symbolChange, fromDate: fromDate, toDate: lastToDate });
                                                        symbolChange = null;
                                                    }
                                                    else {
                                                        symbolChange = codeChange.from;
                                                    }
                                                    break;
                                                }
                                                if (!codeChange.from_date) {
                                                    // we don't know the from date
                                                    // we can't go any further
                                                    codeChange.from_date = fromDate;
                                                    symbolChange = null;
                                                }
                                                // if (!fromDate && !toDate)
                                                //     break;
                                                // we only need the one overlapped
                                                // let codeChangeFromDate = codeChange.from_date;
                                                // if (!codeChangeFromDate)
                                                // the from date never be null
                                                // and the code change rang must be within the date selection range
                                                // if (fromDate >= codeChange.from_date && (!codeChange.to_date || toDate < codeChange.to_date)) {
                                                //     // within range
                                                //     // use only the new symbol, and there is no finite date yet
                                                //     symbolDates.unshift({symbol: codeChange.to, fromDate: fromDate, toDate: toDate});
                                                //     break;
                                                // }
                                                // else if (toDate < codeChange.from_date && fromDate < codeChange.from_date) {
                                                //     // use only the old symbol
                                                //     // but we need to check if old symbol has code change before
                                                //     symbolChange = codeChange.from;
                                                // }
                                                // else {
                                                //     // use both symbols
                                                //     symbolDates.unshift({symbol: codeChange.to, from_date: codeChange.from_date, to_date: toDate});
                                                //     // symbolDates.unshift({symbol: codeChange.from, from_date: codeChange.from_date, to_date: toDate});
                                                //     // but we need to check if old symbol has code change before
                                                //     toDate = codeChange.from_date;
                                                //     toDate.setDate(toDate.getDate() - 1);
                                                //     symbolChange = codeChange.from;
                                                // }
                                            }
                                            if (i == codeChangesArray.length) {
                                                // we didn't find anything
                                                symbolDates.unshift({ symbol: symbolChange, fromDate: fromDate, toDate: toDate });
                                                symbolChange = null;
                                            }
                                        }
                                        else {
                                            // so no more code changes
                                            symbolDates.unshift({ symbol: symbolChange, fromDate: fromDate, toDate: toDate });
                                            // reset the symbol change to empty
                                            symbolChange = null;
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 1;
                    case 1:
                        if (!symbolChange) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        symbolDates.unshift({ symbol: symbol, fromDate: fromDate, toDate: toDate });
                        _a.label = 5;
                    case 5:
                        rows = new Array();
                        columnNames = new Array();
                        columnNames.push('date');
                        columnNames.push('open');
                        columnNames.push('close');
                        columnNames.push('high');
                        columnNames.push('low');
                        columnNames.push('volume');
                        dateArray = [];
                        x = 0;
                        _a.label = 6;
                    case 6:
                        if (!(x < symbolDates.length)) return [3 /*break*/, 11];
                        symbolDate = symbolDates[x];
                        dateStringArray = RedisClient.getDateStringArray(symbolDate.fromDate, symbolDate.toDate);
                        keyStr = (keyPrefix || '') + symbolDate.symbol;
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < dateStringArray.length)) return [3 /*break*/, 10];
                        field = dateStringArray[i];
                        return [4 /*yield*/, this.hget(keyStr, field)];
                    case 8:
                        tmpStr = _a.sent();
                        if (tmpStr) {
                            row = new Array();
                            try {
                                obj = JSON.parse(tmpStr);
                                dateArray.push(field);
                                row.push(field);
                                row.push(obj.O);
                                row.push(obj.C);
                                row.push(obj.H);
                                row.push(obj.L);
                                row.push(obj.V);
                                rows.push(row);
                            }
                            catch (err) {
                                //
                                console.error("Data format error, skipping date: " + field + " with data: " + tmpStr);
                                console.error(err);
                            }
                        }
                        _a.label = 9;
                    case 9:
                        ++i;
                        return [3 /*break*/, 7];
                    case 10:
                        ++x;
                        return [3 /*break*/, 6];
                    case 11:
                        dataFrame = new RedisDataFrame({
                            rows: rows,
                            columnNames: columnNames,
                        });
                        dataFrame.dateArray = dateArray;
                        dataFrame.symbol = symbol;
                        dataFrame.fromDate = fromDate;
                        dataFrame.toDate = toDate;
                        dataFrame.keyPrefix = keyPrefix;
                        dataFrame.codeChangeKeyPrefix = codeChangeKeyPrefix;
                        return [2 /*return*/, dataFrame];
                }
            });
        });
    };
    return RedisClient;
}());
exports.RedisClient = RedisClient;
/**
 * @hidden
 *
 */
var AsyncRedisDataLoader = /** @class */ (function () {
    function AsyncRedisDataLoader(options) {
        if (!AsyncRedisDataLoader.client)
            AsyncRedisDataLoader.client = new RedisClient(options);
    }
    AsyncRedisDataLoader.prototype.update = function (oldDataFrame, toDate) {
        throw AsyncRedisDataLoader.client.update(oldDataFrame, toDate);
    };
    AsyncRedisDataLoader.prototype.loadByDateArray = function (symbol, dateArray, keyPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, AsyncRedisDataLoader.client.loadByDateArray(symbol, dateArray, keyPrefix)];
            });
        });
    };
    AsyncRedisDataLoader.prototype.load = function (symbol, fromDate, toDate, keyPrefix, codeChangeKeyPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, AsyncRedisDataLoader.client.load(symbol, fromDate, toDate, keyPrefix, codeChangeKeyPrefix)];
            });
        });
    };
    AsyncRedisDataLoader.prototype.write = function (key, field, value) {
        AsyncRedisDataLoader.client.hset(key, field, value);
        return this;
    };
    AsyncRedisDataLoader.prototype.get_client = function () {
        return AsyncRedisDataLoader.client;
    };
    return AsyncRedisDataLoader;
}());
function fromRedis(options) {
    return new AsyncRedisDataLoader(options);
}
exports.fromRedis = fromRedis;
dataForge.fromRedis = fromRedis;
// (dataForge as any).fromRedisSync = fromRedisSync;
//# sourceMappingURL=index.js.map