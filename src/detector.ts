import { getDistanceBetweenPoints } from "./distanceUtils"
import { Flight } from "./flight"
import { TaskResults } from "./taskResults"


const minimumDistance: number = 20
const minimumAltDifference: number = 20

class CloseCall {
    glider1: string
    glider2: string
    time: string
    distance: number
    altitudeDifference: number
    timestamp: number
    task: string

    constructor(glider1: string, glider2: string, time: string, distance: number, altDifference: number, timestamp: number, task: string) {
        this.glider1 = glider1
        this.glider2 = glider2
        this.time = time
        this.distance = distance
        this.altitudeDifference = altDifference
        this.timestamp = timestamp
        this.task = task
    }
}

class Detector {

    taskResults: TaskResults

    analyzeFlights(flight1: Flight, flight2: Flight) {

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
                    this.taskResults.reportEvent(closeCall)
                }
            }
        });
    }

    constructor(taskResults: TaskResults) {
        this.taskResults = taskResults
    }
}

export { Detector, CloseCall }