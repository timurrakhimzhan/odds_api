"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertSportsRowQ(sportName) {
    return "INSERT INTO sports (name) VALUES ('" + sportName + "')";
}
exports.insertSportsRowQ = insertSportsRowQ;
function insertLeagueRowQ(leagueName, url, sport) {
    return "INSERT INTO leagues (name, url, sports_id) VALUES \n                                                        (\n                                                        '" + leagueName + "',\n                                                        '" + url + "',\n                                                        (SELECT id FROM sports WHERE UPPER(name)=UPPER('" + sport + "'))\n                                                        )";
}
exports.insertLeagueRowQ = insertLeagueRowQ;
function insertTeamRowQ(team, sports_id, leagues_id) {
    return "INSERT INTO teams (name, sports_id, leagues_id) VALUES ('" + team + "', " + sports_id + ", " + leagues_id + ")";
}
exports.insertTeamRowQ = insertTeamRowQ;
function insertMatchRowQ(matchDB) {
    var keys = Object.keys(matchDB);
    var values = Object.values(matchDB);
    var status = "finished";
    if (!matchDB.score_1 || !matchDB.score_2 || isNaN(matchDB.score_1) || isNaN(matchDB.score_2)) {
        values = values.filter(function (value, i) { return !keys[i].includes("score"); });
        keys = keys.filter(function (key) { return !key.includes("score"); });
        status = "progress";
    }
    var insertValues = values.map(function (value, i) {
        if (isNaN(value))
            return "'" + value + "'";
        if (keys[i].includes("coeff")) {
            return "ARRAY[" + value + "]";
        }
        return value;
    }).join(", ");
    return "INSERT INTO matches (" + keys.join(", ") + ", status) VALUES (" + insertValues + ", '" + status + "')";
}
exports.insertMatchRowQ = insertMatchRowQ;
