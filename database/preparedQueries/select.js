"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var select_1 = require("../queries/select");
function selectAllleaguesPQ() {
    return {
        text: select_1.selectAllLeaguesQ()
    };
}
exports.selectAllleaguesPQ = selectAllleaguesPQ;
function selectLeaguesPQ(name) {
    return {
        text: select_1.selectLeaguesQ(),
        values: [name]
    };
}
exports.selectLeaguesPQ = selectLeaguesPQ;
function selectMatchByAbbrevPQ(match) {
    var sport = match.sport, league = match.league, date = match.date, team_1_abbreviation = match.team_1_abbreviation, team_2_abbreviation = match.team_2_abbreviation, score_1 = match.score_1, score_2 = match.score_2;
    return {
        text: select_1.selectMatchByAbbrevQ(),
        values: [sport, league, date, team_1_abbreviation, team_2_abbreviation, score_1, score_2]
    };
}
exports.selectMatchByAbbrevPQ = selectMatchByAbbrevPQ;
function selectMatchByFLPQ(match) {
    var sport = match.sport, league = match.league, date = match.date, team_1 = match.team_1, team_2 = match.team_2, score_1 = match.score_1, score_2 = match.score_2;
    return {
        text: select_1.selectMatchByFLQ(),
        values: [sport, league, date, team_1[0] + "%", team_2[0] + "%", score_1, score_2]
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
function selectMatchByStatusPQ(league, status) {
    if (status === void 0) { status = "finished"; }
    return {
        text: select_1.selectMatchByStatusQ(),
        values: [status, league]
    };
}
exports.selectMatchByStatusPQ = selectMatchByStatusPQ;
