"use strict";
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
exports.Flight = void 0;
var takeoffAltitude = 50;
var FlightFix = /** @class */ (function () {
    function FlightFix(rawFix) {
        this.latitude = rawFix.latitude;
        this.longitude = rawFix.longitude;
        this.altitude = rawFix.pressureAltitude == null ? rawFix.gpsAltitude : rawFix.pressureAltitude;
        this.timestamp = rawFix.timestamp;
        this.time = rawFix.time;
    }
    return FlightFix;
}());
var Flight = /** @class */ (function () {
    function Flight(rawFile) {
        var e_1, _a;
        var _this = this;
        this.fixes = [];
        this.takeoffAt = 0;
        this.callsign = rawFile.callsign;
        rawFile.fixes.forEach(function (fix) {
            _this.fixes.push(new FlightFix(fix));
        });
        this.usesGPSAlt = (rawFile.fixes[0].pressureAltitude == null);
        try {
            for (var _b = __values(this.fixes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fix = _c.value;
                if (fix.altitude > this.fixes[0].altitude + takeoffAltitude) {
                    this.takeoffAt = fix.timestamp;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.fixes.every(function (fix) {
        });
    }
    return Flight;
}());
exports.Flight = Flight;
