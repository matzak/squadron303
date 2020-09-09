import * as IGCParser from "igc-parser"
import * as glob from "glob"
import fs = require('fs');
import { Flight } from "./flight"

const maximumFixInteval: number = 1000 // 1 second

function callsignFromFileName(file: string): string {
    return file.split('_')[1].split('.')[0]
}

function fixInterval(flight: Flight): number {
    return flight.fixes[1].timestamp - flight.fixes[0].timestamp
}

class LoadIssue {
    callsign: string
    noBaroData: boolean = false
    fixInterval: number = 0
    cantParse: boolean = false

    detected(): boolean {
        return this.noBaroData || this.cantParse || this.fixInterval > 0
    }

    constructor(callsign: string) {
        this.callsign = callsign
    }
}

export function loadLogs(): [Flight[], LoadIssue[]] {
    let logs: Flight[] = []
    let issues: LoadIssue[] = []
    let files = glob.sync("*.igc")

    files.forEach(file => {
        let content = fs.readFileSync(file,'utf8')
        let parser: any = IGCParser
        console.log("Trying to open file:", file)
        let rawflight: any
        try {
            rawflight = parser.parse(content)
            let flight = new Flight(rawflight)

            if(flight.callsign == undefined || flight.callsign.length == 0 ) {
                flight.callsign = callsignFromFileName(file)
            }

            let issue = new LoadIssue(flight.callsign)

            console.log("New flight loaded. Callsing: ", flight.callsign)
            if (flight.usesGPSAlt) {
                issue.noBaroData = true
                console.log("No baro data, using GPS altitude.")
            }

            if (fixInterval(flight) > maximumFixInteval) {
                issue.fixInterval = fixInterval(flight)
                console.log("Wrong fix inteval:", fixInterval(flight))
            }

            console.log("---")

            logs.push(flight)
            if (issue.detected()) {
                issues.push(issue)
            }
        }
        catch {
            let issue = new LoadIssue(callsignFromFileName(file))
            issue.cantParse = true
            issues.push(issue)
            console.log("Can't parse file:", file)
        }
    });

    return [logs, issues]
}

export { LoadIssue }