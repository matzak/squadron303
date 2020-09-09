"use strict";
exports.__esModule = true;
exports.loadLogs = void 0;
var IGCParser = require("igc-parser");
var glob = require("glob");
var fs = require("fs");
var flight_1 = require("./flight");
function callsignFromFileName(file) {
    return file.split('_')[1].split('.')[0];
}
function loadLogs() {
    var result = [];
    var files = glob.sync("*.igc");
    files.forEach(function (file) {
        var content = fs.readFileSync(file, 'utf8');
        var parser = IGCParser;
        console.log("Trying to open file:", file);
        var rawflight;
        try {
            rawflight = parser.parse(content);
            var flight = new flight_1.Flight(rawflight);
            if (flight.callsign == undefined || flight.callsign.length == 0) {
                flight.callsign = callsignFromFileName(file);
            }
            console.log("New flight loaded. Callsing: ", flight.callsign, flight.usesGPSAlt ? "- no baro data, using GPS altitude." : "");
            result.push(flight);
        }
        catch (_a) {
            console.log("Can't parse file:", file);
        }
    });
    return result;
}
exports.loadLogs = loadLogs;
