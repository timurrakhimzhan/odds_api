"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectMatchByStatusPQ = exports.selectMatchPQ = exports.selectMatchByFLPQ = exports.selectMatchByAbbrevPQ = exports.selectLeaguesPQ = exports.selectAllleaguesPQ = void 0;
const select_1 = require("../queries/select");
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
    const { sport, league, date, team_1_abbreviation, team_2_abbreviation, score_1, score_2 } = match;
    return {
        text: select_1.selectMatchByAbbrevQ(),
        values: [sport, league, date, team_1_abbreviation, team_2_abbreviation, score_1, score_2]
    };
}
exports.selectMatchByAbbrevPQ = selectMatchByAbbrevPQ;
function selectMatchByFLPQ(match) {
    const { sport, league, date, team_1, team_2, score_1, score_2 } = match;
    return {
        text: select_1.selectMatchByFLQ(),
        values: [sport, league, date, team_1[0] + "%", team_2[0] + "%", score_1, score_2]
    };
}
exports.selectMatchByFLPQ = selectMatchByFLPQ;
function selectMatchPQ(matchCrawled) {
    const { teamCrawled_1, teamCrawled_2 } = matchCrawled;
    return {
        text: select_1.selectMatchQ(matchCrawled),
        values: [teamCrawled_1, teamCrawled_2]
    };
}
exports.selectMatchPQ = selectMatchPQ;
function selectMatchByStatusPQ(league, status = "finished") {
    return {
        text: select_1.selectMatchByStatusQ(),
        values: [status, league]
    };
}
exports.selectMatchByStatusPQ = selectMatchByStatusPQ;
