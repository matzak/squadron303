import { getDistanceBetweenPoints } from "./distanceUtils"
import { Flight } from "./flight"
import { TaskResults, CloseCall } from "./taskResults"
import { loadLogs } from "./loader"

const cliProgress = require('cli-progress');
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const minimumDistance: number = 20
const minimumAltDifference: number = 20

function analyzeFlights(flight1: Flight, flight2: Flight) {

    if (flight1.task != flight2.task) {
        // Don't campare fixes between different competition days.
        return
    }

    flight1.fixes.forEach(fix1 => {

        let fix2 = flight2.fixes.find(function(fix) {
            return fix1.timestamp == fix.timestamp
        })
    
        if (fix2 != undefined) {
            let distance = getDistanceBetweenPoints(fix1.latitude, fix1.longitude, fix2.latitude, fix2.longitude)
            let altDifference = Math.abs(fix1.altitude - fix2.altitude)
            if (distance < minimumDistance && 
                altDifference < minimumAltDifference &&
                fix1.timestamp > flight1.takeoffAt &&
                fix2.timestamp > flight2.takeoffAt) {
                let closeCall = new CloseCall(flight1.callsign, flight2.callsign, fix1.time, distance, altDifference, fix1.timestamp, flight1.task)
                taskResults.reportEvent(closeCall)
            }
        }
    });
}

function detectAllEventsDuringTask() {
    // A B C D
    // B C D
    // C D
    // D - break

    let totalNumberOfOperations: number = ((logs.length * logs.length) - logs.length)/2
    var currentProgress: number = 0
    console.log("Searching for dangerous events...")
    progressBar.start(totalNumberOfOperations, 0)

    for(var flightIdx = 0; flightIdx < logs.length; flightIdx++) {
        if (flightIdx + 1 == logs.length) {
            break
        }
        for(var againstFlightIdx = flightIdx + 1; againstFlightIdx < logs.length; againstFlightIdx++) {
            analyzeFlights(logs[flightIdx], logs[againstFlightIdx])
            currentProgress++
            progressBar.update(currentProgress)
        }
    }
    progressBar.stop()
}

console.log("\n\nSquadron303 - another useless safety tool for gliding competitions.")
console.log("https://github.com/matzak/squadron303\n")


let loadResult = loadLogs()
let logs = loadResult[0]
let issues = loadResult[1]
let taskResults = new TaskResults() 

taskResults.reportLoadIssues(issues)
detectAllEventsDuringTask()
taskResults.generateHTMLReport()

