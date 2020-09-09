"use strict";
exports.__esModule = true;
var IGCParser = require("igc-parser");
var fs = require("fs");
var distanceUtils_1 = require("./distanceUtils");
var glob = require("glob");
var flight_1 = require("./flight");
var taskResults_1 = require("./taskResults");
var minimumDistance = 20;
var minimumAltDifference = 20;
function loadLogs() {
    var result = [];
    var files = glob.sync("*.igc");
    files.forEach(function (file) {
        var content = fs.readFileSync(file, 'utf8');
        var parser = IGCParser;
        console.log("Trying to open file:", file);
        var rawflight = parser.parse(content);
        var flight = new flight_1.Flight(rawflight);
        console.log("New flight loaded. Callsing: ", flight.callsign, flight.usesGPSAlt ? "- no baro data, using GPS altitude." : "");
        result.push(flight);
    });
    return result;
}
function analyzeFlights(flight1, flight2) {
    console.log(flight1.callsign, " vs ", flight2.callsign);
    flight1.fixes.forEach(function (fix1) {
        var fix2 = flight2.fixes.find(function (fix) {
            return fix1.timestamp == fix.timestamp;
        });
        if (fix2 != undefined) {
            var distance = distanceUtils_1.getDistanceBetweenPoints(fix1.latitude, fix1.longitude, fix2.latitude, fix2.longitude);
            var altDifference = Math.abs(fix1.altitude - fix2.altitude);
            if (distance < minimumDistance && altDifference < minimumAltDifference) {
                var closeCall = new taskResults_1.CloseCall(flight1.callsign, flight2.callsign, fix1.time, distance, altDifference, fix1.timestamp);
                taskResults.reportEvent(closeCall);
            }
        }
    });
}
function detectAllEventsDuringTask() {
    // A B C D
    // B C D
    // C D
    // D - break
    for (var flightIdx = 0; flightIdx < logs.length; flightIdx++) {
        if (flightIdx + 1 == logs.length) {
            break;
        }
        for (var againstFlightIdx = flightIdx + 1; againstFlightIdx < logs.length; againstFlightIdx++) {
            analyzeFlights(logs[flightIdx], logs[againstFlightIdx]);
        }
    }
}
var logs = loadLogs();
var taskResults = new taskResults_1.TaskResults();
detectAllEventsDuringTask();
taskResults.eventsToConsole();
taskResults.hallOfShameToConsole();
