import fs = require("fs");

const file = "config.json";

var jsonData: Config;

class Config {
  teams: string[][] = [];
  minimumTimeIntervalBetweenEvents: number = 5; // 5 seconds

  constructor() {
    try {
      let buffer = fs.readFileSync(file)?.toString();
      let config: Config = JSON.parse(buffer);
      this.teams = config.teams;
      this.minimumTimeIntervalBetweenEvents =
        config.minimumTimeIntervalBetweenEvents;
    } catch {
      // Do nothing
    }
  }
}

export { Config };
