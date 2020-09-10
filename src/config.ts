import fs = require('fs');

const file = "config.json"

var jsonData: Config

class Config {
    teams: string[][] = []

    constructor() {
        try {
            let buffer = fs.readFileSync(file)?.toString()
            let config: Config = JSON.parse(buffer)
            this.teams = config.teams
        }
        catch {
            // Do nothing
        }
    }
}

export { Config }