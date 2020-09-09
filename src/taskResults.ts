
const eventTimeWindow: number  = 5000 // 5 seconds

class CloseCall {
    glider1: string
    glider2: string
    time: string
    distance: number
    altitudeDifference: number
    timestamp: number

    constructor(glider1: string, glider2: string, time: string, distance: number, altDifference: number, timestamp: number) {
        this.glider1 = glider1
        this.glider2 = glider2
        this.time = time
        this.distance = distance
        this.altitudeDifference = altDifference
        this.timestamp = timestamp
    }
}

class TaskResults {
    private closeCalls: CloseCall[] = []
    private lastEvent?: CloseCall = undefined

    //TODO: refactoring needed as it may generate invalid data if used in wrong order
    reportEvent(closeCall: CloseCall) {
        console.log("Reporting event:", closeCall)
        if (this.lastEvent != undefined) {
            if (closeCall.glider1 == this.lastEvent.glider1 && 
                closeCall.glider2 == this.lastEvent.glider2 && 
                closeCall.timestamp - this.lastEvent.timestamp <= eventTimeWindow) {
                    console.log("Event will be skipped due to:", this.lastEvent)
                }
            else {
                this.closeCalls.push(closeCall)
            }
        }
        else {
            this.closeCalls.push(closeCall)
        }
        this.lastEvent = closeCall
    }

    eventsToConsole() {
        this.closeCalls.forEach(closeCall => {
            console.log(closeCall.glider1, " vs ", closeCall.glider2, " at ", closeCall.time, "(distance: ", closeCall.distance,", alt difference:", closeCall.altitudeDifference)

        });
        console.log("Total number of events:", this.closeCalls.length)
    }

    hallOfShameToConsole() {
        let results: Map<string, number> = new Map<string, number>()

        
        results[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }
        
        
        this.closeCalls.forEach(closeCall => {
            
            let glider1Score = results.get(closeCall.glider1)
            let glider2Score = results.get(closeCall.glider2)

            if ( glider1Score == undefined) {
                glider1Score = 0
            }

            if ( glider2Score == undefined) {
                glider2Score = 0
            }
            
            results.set(closeCall.glider1, glider1Score+1)
            results.set(closeCall.glider2, glider2Score+1)
        })

        var position = 1

        console.log("Hall of shame")
        for (let [key, value] of results) {
            console.log("#", position, " ", key + ' ' + value);
            position++
        }
        
    }
}

export { TaskResults, CloseCall }