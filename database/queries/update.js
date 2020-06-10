"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateMatchQ(matchCrawled) {
    var teamCrawled_1 = matchCrawled.teamCrawled_1, teamCrawled_2 = matchCrawled.teamCrawled_2, scoreCrawled_1 = matchCrawled.scoreCrawled_1, scoreCrawled_2 = matchCrawled.scoreCrawled_2, coeffCrawled_1 = matchCrawled.coeffCrawled_1, coeffCrawled_2 = matchCrawled.coeffCrawled_2, dateCrawled = matchCrawled.dateCrawled;
    if (scoreCrawled_1 && scoreCrawled_2) {
        return "UPDATE matches SET coeff_1=coeff_1 || " + coeffCrawled_1 + ",\n                               coeff_2=coeff_2 || " + coeffCrawled_2 + ",\n                               score_1=" + scoreCrawled_1 + ",\n                               score_2=" + scoreCrawled_2 + ",\n                               status='finished'\n                             WHERE UPPER(team_1)=UPPER('" + teamCrawled_1 + "')\n                               AND UPPER(team_2)=UPPER('" + teamCrawled_2 + "')\n                               AND date='" + dateCrawled + "'";
    }
    return "UPDATE matches SET coeff_1=coeff_1 || " + coeffCrawled_1 + ",\n                               coeff_2=coeff_2 || " + coeffCrawled_2 + "\n                             WHERE UPPER(team_1)=UPPER('" + teamCrawled_1 + "') \n                               AND UPPER(team_2)=UPPER('" + teamCrawled_2 + "')\n                               AND date='" + dateCrawled + "'";
}
exports.updateMatchQ = updateMatchQ;
function updateAbbreviationQ(id, abbreviation) {
    return "UPDATE teams SET abbreviation='" + abbreviation + "' WHERE id=" + id + " AND abbreviation IS NULL";
}
exports.updateAbbreviationQ = updateAbbreviationQ;
function updateMatchDateQ(id, date) {
    return "UPDATE matches SET date='" + date + "' WHERE id=" + id;
}
exports.updateMatchDateQ = updateMatchDateQ;
