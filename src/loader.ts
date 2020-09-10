import * as IGCParser from "igc-parser"
import * as glob from "glob"
import fs = require('fs');
import { Flight } from "./flight"

const cliProgress = require('cli-progress');
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const maximumFixInteval: number = 1000 // 1 second

function callsignFromFileName(file: string): string {
    return file.split('_')[1].split('.')[0]
}

function taskFromFileName(file: string): string {
    return file.split('_')[0]
}

function fixInterval(flight: Flight): number {
    return flight.fixes[1].timestamp - flight.fixes[0].timestamp
}

class LoadIssue {
    callsign: string
    noBaroData: boolean = false
    fixInterval: number = 0
    cantParse: boolean = false
    task: string = ""

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

    var currentProgress: number = 0

    console.log("Loading IGC files...")
    progressBar.start(files.length, 0)
    
    files.forEach(file => {
        let content = fs.readFileSync(file,'utf8')
        let parser: any = IGCParser
        let rawflight: any
        try {
            rawflight = parser.parse(content)
            let flight = new Flight(rawflight, taskFromFileName(file))

            if(flight.callsign == undefined || flight.callsign.length == 0 ) {
                flight.callsign = callsignFromFileName(file)
            }

            let issue = new LoadIssue(flight.callsign)
            issue.task = flight.task

            if (flight.usesGPSAlt) {
                issue.noBaroData = true
            }

            if (fixInterval(flight) > maximumFixInteval) {
                issue.fixInterval = fixInterval(flight)
            }

            logs.push(flight)
            if (issue.detected()) {
                issues.push(issue)
            }
        }
        catch {
            let issue = new LoadIssue(callsignFromFileName(file))
            issue.task = taskFromFileName(file)
            issue.cantParse = true
            issues.push(issue)
        }

        currentProgress++
        progressBar.update(currentProgress)
    });

    progressBar.stop()

    return [logs, issues]
}

export { LoadIssue }