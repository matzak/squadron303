const takeoffAltitude: number = 100;

class FlightFix {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
  time: string;

  constructor(rawFix: any) {
    this.latitude = rawFix.latitude;
    this.longitude = rawFix.longitude;
    this.altitude =
      rawFix.pressureAltitude == null
        ? rawFix.gpsAltitude
        : rawFix.pressureAltitude;
    this.timestamp = rawFix.timestamp;
    this.time = rawFix.time;
  }
}

class Flight {
  callsign: string;
  fixes: FlightFix[] = [];
  usesGPSAlt: boolean;
  takeoffAt: number = 0;
  task: string;
  team: string[] = [];

  constructor(rawFile: any, task: string) {
    this.callsign = rawFile.callsign;
    rawFile.fixes.forEach((fix: any) => {
      this.fixes.push(new FlightFix(fix));
    });
    this.usesGPSAlt = rawFile.fixes[0].pressureAltitude == null;
    this.task = task;
    for (let fix of this.fixes) {
      if (fix.altitude > this.fixes[0].altitude + takeoffAltitude) {
        this.takeoffAt = fix.timestamp;
        break;
      }
    }
  }
}

export { Flight };
