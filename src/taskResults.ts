
import { CloseCall} from "./detector"
import { LoadIssue } from "./loader"
import { HTMLReport } from "./htmlReport" 
import fs = require('fs');

const eventTimeWindow: number  = 5000 // 5 seconds

class TaskResults {
    private loadIssues?: LoadIssue[]
    private closeCalls: CloseCall[] = []
    private lastEvent?: CloseCall = undefined

    reportLoadIssues(loadIssues: LoadIssue[]) {
        this.loadIssues = loadIssues
    }

    //TODO: refactoring needed as it may generate invalid data if used in wrong order
    reportEvent(closeCall: CloseCall) {
        if (this.lastEvent != undefined) {
            if (closeCall.glider1 == this.lastEvent.glider1 && 
                closeCall.glider2 == this.lastEvent.glider2 && 
                Math.abs(closeCall.timestamp - this.lastEvent.timestamp) <= eventTimeWindow) {
                    // do nothing, event should be skipped
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

    loadIssuesToConsole() {
        console.log("Loader report:")
        console.log(this.loadIssues)
    }

    eventsToConsole() {
        this.closeCalls.forEach(closeCall => {
            console.log(closeCall)

        });
        console.log("Total number of events:", this.closeCalls.length)
    }

    private shameResults: Map<string, number> = new Map<string, number>()


    hallOfShameToConsole() {
        this.generateShameData()
        var position = 1

        console.log("Hall of shame")
        for (let [key, value] of this.shameResults) {
            console.log("#", position, " ", key + ' ' + value);
            position++
        }
    }

    generateHTMLReport() {
        const issueRows = this.loadIssues?.map(HTMLReport.createIssueRow).join('') ?? ""
        const issueTable = HTMLReport.createIssueTable(issueRows)
        const eventRows = this.closeCalls.map(HTMLReport.createEventRow).join('')
        const eventTable = HTMLReport.createEventsTable(eventRows)
        
        this.generateShameData()

        var position = 1
        let shameInput: [number, string, number][] = []
        for (let [key, value] of this.shameResults) {
            shameInput.push([position, key, value])
            position++
        }
        
        const shameRows = shameInput.map(HTMLReport.createShameRow).join('')
        const shameTable = HTMLReport.createShameTable(shameRows)

        const htmlReport = HTMLReport.createHtml(issueTable, eventTable, shameTable, this.closeCalls.length)

        fs.writeFileSync("report.html",htmlReport)
        console.log("Report saved to report.html file.")
    }

    private generateShameData() {
        this.shameResults = new Map<string, number>()

        this.shameResults[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }
        
        
        this.closeCalls.forEach(closeCall => {            
            let glider1Score = this.shameResults.get(closeCall.glider1) ?? 0
            let glider2Score = this.shameResults.get(closeCall.glider2) ?? 0
 
            this.shameResults.set(closeCall.glider1, glider1Score+1)
            this.shameResults.set(closeCall.glider2, glider2Score+1)
        })
    }
}

export { TaskResults }