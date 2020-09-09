
import * as IGCParser from "igc-parser"
import fs = require('fs');
import { getDistanceBetweenPoints } from "./distanceUtils"
import * as glob from "glob"
import { Flight } from "./flight"
import { TaskResults, CloseCall } from "./taskResults"

const minimumDistance: number = 20
const minimumAltDifference: number = 20

function loadLogs(): Flight[] {
    let result: Flight[] = []
    let files = glob.sync("*.igc")

    files.forEach(file => {
        let content = fs.readFileSync(file,'utf8')
        let parser: any = IGCParser
        console.log("Trying to open file:", file)
        let rawflight = parser.parse(content)
        let flight = new Flight(rawflight)

        console.log("New flight loaded. Callsing: ", flight.callsign, flight.usesGPSAlt ? "- no baro data, using GPS altitude." : "")
        result.push(flight)
    });

    return result
}

function analyzeFlights(flight1: Flight, flight2: Flight) {
    console.log(flight1.callsign, " vs ", flight2.callsign)
    flight1.fixes.forEach(fix1 => {

        let fix2 = flight2.fixes.find(function(fix) {
            return fix1.timestamp == fix.timestamp
        })
    
        if (fix2 != undefined) {
            let distance = getDistanceBetweenPoints(fix1.latitude, fix1.longitude, fix2.latitude, fix2.longitude)
            let altDifference = Math.abs(fix1.altitude - fix2.altitude)
            if (distance < minimumDistance && altDifference < minimumAltDifference) {
                let closeCall = new CloseCall(flight1.callsign, flight2.callsign, fix1.time, distance, altDifference, fix1.timestamp)
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
    for(var flightIdx = 0; flightIdx < logs.length; flightIdx++) {
        if (flightIdx + 1 == logs.length) {
            break
        }
        for(var againstFlightIdx = flightIdx + 1; againstFlightIdx < logs.length; againstFlightIdx++) {
            analyzeFlights(logs[flightIdx], logs[againstFlightIdx])
        }
    }
}



let logs = loadLogs();
let taskResults = new TaskResults() 

detectAllEventsDuringTask()
taskResults.eventsToConsole()
taskResults.hallOfShameToConsole()