"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var insert_1 = require("../queries/insert");
function insertLeagueRowPQ(sport, leagueName, url) {
    return {
        text: insert_1.insertLeagueRowQ(),
        values: [leagueName, url, sport]
    };
}
exports.insertLeagueRowPQ = insertLeagueRowPQ;
function insertSportsRowPQ(sportName) {
    return {
        text: insert_1.insertSportsRowQ(),
        values: [sportName]
    };
}
exports.insertSportsRowPQ = insertSportsRowPQ;
function insertMatchRowPQ(team_1, team_2, league, season_id, matchDB) {
    return {
        text: insert_1.insertMatchRowQ(league, season_id, matchDB),
        values: [team_1, team_2]
    };
}
exports.insertMatchRowPQ = insertMatchRowPQ;