"use strict";
exports.__esModule = true;
var distanceUtils_1 = require("./distanceUtils");
var taskResults_1 = require("./taskResults");
var loader_1 = require("./loader");
var cliProgress = require('cli-progress');
var progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
var minimumDistance = 20;
var minimumAltDifference = 20;
function analyzeFlights(flight1, flight2) {
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
    var totalNumberOfOperations = ((logs.length * logs.length) - logs.length) / 2;
    var currentProgress = 0;
    console.log("Searching for dangerous events...");
    progressBar.start(totalNumberOfOperations, 0);
    for (var flightIdx = 0; flightIdx < logs.length; flightIdx++) {
        if (flightIdx + 1 == logs.length) {
            break;
        }
        for (var againstFlightIdx = flightIdx + 1; againstFlightIdx < logs.length; againstFlightIdx++) {
            analyzeFlights(logs[flightIdx], logs[againstFlightIdx]);
            currentProgress++;
            progressBar.update(currentProgress);
        }
    }
    progressBar.stop();
}
console.log("\n\nSquadron303 - another useless safety tool for gliding competitions.");
console.log("https://github.com/matzak/squadron303\n");
var loadResult = loader_1.loadLogs();
var logs = loadResult[0];
var issues = loadResult[1];
var taskResults = new taskResults_1.TaskResults();
taskResults.reportLoadIssues(issues);
detectAllEventsDuringTask();
taskResults.generateHTMLReport();
