class FlightFix {
    latitude: number
    longitude: number
    altitude: number
    timestamp: number
    time: string

    constructor(rawFix: any) {
        this.latitude = rawFix.latitude
        this.longitude = rawFix.longitude
        this.altitude = rawFix.pressureAltitude == null ? rawFix.gpsAltitude : rawFix.pressureAltitude
        this.timestamp = rawFix.timestamp
        this.time = rawFix.time
    }
}

class Flight {
    callsign: string
    fixes: FlightFix[] = []
    usesGPSAlt: boolean

    constructor(rawFile: any) {
        this.callsign = rawFile.callsign
        rawFile.fixes.forEach((fix: any) => {
            this.fixes.push(new FlightFix(fix))
        });
        this.usesGPSAlt = (rawFile.fixes[0].pressureAltitude == null)
    }
}

export { Flight }