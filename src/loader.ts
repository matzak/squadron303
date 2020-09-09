import * as IGCParser from "igc-parser"
import * as glob from "glob"
import fs = require('fs');
import { Flight } from "./flight"

function callsignFromFileName(file: string): string {
    return file.split('_')[1].split('.')[0]
}

export function loadLogs(): Flight[] {
    let result: Flight[] = []
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

            console.log("New flight loaded. Callsing: ", flight.callsign, flight.usesGPSAlt ? "- no baro data, using GPS altitude." : "")
            result.push(flight)
        }
        catch {
            console.log("Can't parse file:", file)
        }
    });

    return result
}