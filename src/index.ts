import { Detector } from "./detector";
import { Report } from "./report";
import { loadLogs } from "./loader";

const cliProgress = require("cli-progress");
const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

const report = new Report();
const detector = new Detector(report);

function detectAllEventsDuringTask() {
  let totalNumberOfOperations: number =
    (logs.length * logs.length - logs.length) / 2;
  var currentProgress: number = 0;
  console.log("Searching for dangerous events...");
  progressBar.start(totalNumberOfOperations, 0);

  for (var flightIdx = 0; flightIdx < logs.length - 1; flightIdx++) {
    for (
      var againstFlightIdx = flightIdx + 1;
      againstFlightIdx < logs.length;
      againstFlightIdx++
    ) {
      detector.analyzeFlights(logs[flightIdx], logs[againstFlightIdx]);
      currentProgress++;
      progressBar.update(currentProgress);
    }
  }
  progressBar.stop();
}

console.log(
  "\n\nSquadron303 - another useless safety tool for gliding competitions."
);
console.log("https://github.com/matzak/squadron303\n");

let loadResult = loadLogs();
let logs = loadResult[0];
let issues = loadResult[1];

report.reportLoadIssues(issues);
detectAllEventsDuringTask();
report.generateHTMLReport();
