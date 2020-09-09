"use strict";
exports.__esModule = true;
exports.LoadIssue = exports.loadLogs = void 0;
var IGCParser = require("igc-parser");
var glob = require("glob");
var fs = require("fs");
var flight_1 = require("./flight");
var maximumFixInteval = 1000; // 1 second
function callsignFromFileName(file) {
    return file.split('_')[1].split('.')[0];
}
function fixInterval(flight) {
    return flight.fixes[1].timestamp - flight.fixes[0].timestamp;
}
var LoadIssue = /** @class */ (function () {
    function LoadIssue(callsign) {
        this.noBaroData = false;
        this.fixInterval = 0;
        this.cantParse = false;
        this.callsign = callsign;
    }
    LoadIssue.prototype.detected = function () {
        return this.noBaroData || this.cantParse || this.fixInterval > 0;
    };
    return LoadIssue;
}());
exports.LoadIssue = LoadIssue;
function loadLogs() {
    var logs = [];
    var issues = [];
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
            var issue = new LoadIssue(flight.callsign);
            console.log("New flight loaded. Callsing: ", flight.callsign);
            if (flight.usesGPSAlt) {
                issue.noBaroData = true;
                console.log("No baro data, using GPS altitude.");
            }
            if (fixInterval(flight) > maximumFixInteval) {
                issue.fixInterval = fixInterval(flight);
                console.log("Wrong fix inteval:", fixInterval(flight));
            }
            console.log("---");
            logs.push(flight);
            if (issue.detected()) {
                issues.push(issue);
            }
        }
        catch (_a) {
            var issue = new LoadIssue(callsignFromFileName(file));
            issue.cantParse = true;
            issues.push(issue);
            console.log("Can't parse file:", file);
        }
    });
    return [logs, issues];
}
exports.loadLogs = loadLogs;
