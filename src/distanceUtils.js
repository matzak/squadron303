"use strict";
exports.__esModule = true;
exports.getDistanceBetweenPoints = void 0;
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function getDistanceBetweenPoints(lat1, lng1, lat2, lng2) {
    // The radius of the planet earth in meters
    var R = 6378137;
    var dLat = degreesToRadians(lat2 - lat1);
    var dLong = degreesToRadians(lng2 - lng1);
    var a = Math.sin(dLat / 2)
        *
            Math.sin(dLat / 2)
        +
            Math.cos(degreesToRadians(lat1))
                *
                    Math.cos(degreesToRadians(lat1))
                *
                    Math.sin(dLong / 2)
                *
                    Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    return distance;
}
exports.getDistanceBetweenPoints = getDistanceBetweenPoints;
