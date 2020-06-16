"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var select_1 = require("../queries/select");
function selectLeaguesPQ(name) {
    return {
        text: select_1.selectLeaguesQ(),
        values: [name]
    };
}
exports.selectLeaguesPQ = selectLeaguesPQ;
function selectMatchByFLPQ(match) {
    var sport = match.sport, league = match.league, team_1 = match.team_1, team_2 = match.team_2;
    return {
        text: select_1.selectMatchByFLQ(match),
        values: [sport, league, team_1[0] + "%", team_2[0] + "%"]
    };
}
exports.selectMatchByFLPQ = selectMatchByFLPQ;
function selectMatchPQ(matchCrawled) {
    var teamCrawled_1 = matchCrawled.teamCrawled_1, teamCrawled_2 = matchCrawled.teamCrawled_2;
    return {
        text: select_1.selectMatchQ(matchCrawled),
        values: [teamCrawled_1, teamCrawled_2]
    };
}
exports.selectMatchPQ = selectMatchPQ;
function selectMatchByStatusPQ(status) {
    if (status === void 0) { status = "finished"; }
    return {
        text: select_1.selectMatchByStatusQ(),
        values: [status]
    };
}
exports.selectMatchByStatusPQ = selectMatchByStatusPQ;
