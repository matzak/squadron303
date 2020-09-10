import { LoadIssue } from "./loader"
import { CloseCall} from "./detector"

class HTMLReport {
    static createHtml = (issuesTable: string, eventsTable: string, shameTable: string, numberOfEvents: number) => `
  <html>
    <head>
      <style>
        table {
          width: 60%;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th, td {
          padding: 15px;
        }
        tr:nth-child(odd) {
          background: #CCC
        }
        tr:nth-child(even) {
          background: #FFF
        }
        .no-content {
          background-color: red;
        }
      </style>
    </head>
    <body>
        <center>
            <font size="+3"><b>Loader report: </b></font><br>
            ${issuesTable}
            <font size="+3"><b>Events report: </b></font><br>
            ${eventsTable}
            <font size="+3"><b>Pilot stats: </b></font><br>
            ${shameTable}
            <br>
            <font size="+1"><b>Total number of dangerous events: ${numberOfEvents}</b></font><br>
        </center>
        <br>
        Generated by Squadron303 - https://github.com/matzak/squadron303
    </body>
  </html>
`;

    static createIssueRow = (item: LoadIssue) => `
  <tr>
    <td>${item.callsign}</td>
    <td>${item.cantParse ? "<center>X</center>" : ""}</td>
    <td>${item.noBaroData ? "<center>X</center>" : ""}</td>
    <td><center>${item.fixInterval > 0 ? item.fixInterval/1000 : ""}</center></td>
    <td>${item.task}</td>
  </tr>
`;

    static createIssueTable = (rows: string) => `
  <table>
    <tr>
        <th>CN</td>
        <th>Can't parse</td>
        <th>No BARO data</td>
        <th>Fix interval (secs)</td>
        <th>Task</td>
    </tr>
    ${rows}
  </table>
`;

    static createEventRow = (item: CloseCall) => `
  <tr>
    <td>${item.glider1}</td>
    <td>${item.glider2}</td>
    <td>${item.time}</td>
    <td>${Math.floor(item.distance)}</td>
    <td>${item.altitudeDifference}</td>
    <td>${item.task}</td>
  </tr>
`;

    static createEventsTable = (rows: string) => `
  <table>
    <tr>
        <th>CN #1</td>
        <th>CN #2</td>
        <th>Time</td>
        <th>Distance (meters)</td>
        <th>Altitude difference (meters)</td>
        <th>Task</td>
    </tr>
    ${rows}
  </table>
`;

    static createShameRow = (item: [number, string, number]) => `
  <tr>
    <td>${item[0]}</td>
    <td>${item[1]}</td>
    <td>${item[2]}</td>
  </tr>
`;

    static createShameTable = (rows: string) => `
  <table>
    <tr>
        <th>#</td>
        <th>CN</td>
        <th>Number of events</td>
    </tr>
    ${rows}
  </table>
`;
}

export { HTMLReport }