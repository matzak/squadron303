"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.CloseCall = exports.TaskResults = void 0;
var eventTimeWindow = 5000; // 5 seconds
var CloseCall = /** @class */ (function () {
    function CloseCall(glider1, glider2, time, distance, altDifference, timestamp) {
        this.glider1 = glider1;
        this.glider2 = glider2;
        this.time = time;
        this.distance = distance;
        this.altitudeDifference = altDifference;
        this.timestamp = timestamp;
    }
    return CloseCall;
}());
exports.CloseCall = CloseCall;
var TaskResults = /** @class */ (function () {
    function TaskResults() {
        this.closeCalls = [];
        this.lastEvent = undefined;
    }
    //TODO: refactoring needed as it may generate invalid data if used in wrong order
    TaskResults.prototype.reportEvent = function (closeCall) {
        console.log("Reporting event:", closeCall);
        if (this.lastEvent != undefined) {
            if (closeCall.glider1 == this.lastEvent.glider1 &&
                closeCall.glider2 == this.lastEvent.glider2 &&
                Math.abs(closeCall.timestamp - this.lastEvent.timestamp) <= eventTimeWindow) {
                console.log("Event will be skipped due to:", this.lastEvent);
            }
            else {
                this.closeCalls.push(closeCall);
            }
        }
        else {
            this.closeCalls.push(closeCall);
        }
        this.lastEvent = closeCall;
    };
    TaskResults.prototype.eventsToConsole = function () {
        this.closeCalls.forEach(function (closeCall) {
            console.log(closeCall.glider1, " vs ", closeCall.glider2, " at ", closeCall.time, "(distance: ", closeCall.distance, ", alt difference:", closeCall.altitudeDifference);
        });
        console.log("Total number of events:", this.closeCalls.length);
    };
    TaskResults.prototype.hallOfShameToConsole = function () {
        var e_1, _a;
        var results = new Map();
        results[Symbol.iterator] = function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [5 /*yield**/, __values(__spread(this.entries()).sort(function (a, b) { return b[1] - a[1]; }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        };
        this.closeCalls.forEach(function (closeCall) {
            var _a, _b;
            var glider1Score = (_a = results.get(closeCall.glider1)) !== null && _a !== void 0 ? _a : 0;
            var glider2Score = (_b = results.get(closeCall.glider2)) !== null && _b !== void 0 ? _b : 0;
            results.set(closeCall.glider1, glider1Score + 1);
            results.set(closeCall.glider2, glider2Score + 1);
        });
        var position = 1;
        console.log("Hall of shame");
        try {
            for (var results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                var _b = __read(results_1_1.value, 2), key = _b[0], value = _b[1];
                console.log("#", position, " ", key + ' ' + value);
                position++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (results_1_1 && !results_1_1.done && (_a = results_1["return"])) _a.call(results_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return TaskResults;
}());
exports.TaskResults = TaskResults;
