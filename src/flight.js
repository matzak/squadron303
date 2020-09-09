"use strict";
exports.__esModule = true;
exports.Flight = void 0;
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
        var _this = this;
        this.fixes = [];
        this.callsign = rawFile.callsign;
        rawFile.fixes.forEach(function (fix) {
            _this.fixes.push(new FlightFix(fix));
        });
        this.usesGPSAlt = (rawFile.fixes[0].pressureAltitude == null);
    }
    return Flight;
}());
exports.Flight = Flight;
