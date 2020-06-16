"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateMatchQ(matchCrawled) {
    var scoreCrawled_1 = matchCrawled.scoreCrawled_1, scoreCrawled_2 = matchCrawled.scoreCrawled_2, coeffCrawled_1 = matchCrawled.coeffCrawled_1, coeffCrawled_2 = matchCrawled.coeffCrawled_2;
    if (scoreCrawled_1 && scoreCrawled_2) {
        return "UPDATE matches SET coeff_1=coeff_1 || " + coeffCrawled_1 + ",\n                               coeff_2=coeff_2 || " + coeffCrawled_2 + ",\n                               score_1=" + scoreCrawled_1 + ",\n                               score_2=" + scoreCrawled_2 + ",\n                               status='finished'\n                             WHERE teams_id_1=(SELECT id FROM teams WHERE name=$1)\n                               AND teams_id_2=(SELECT id FROM teams WHERE name=$2)\n                               AND date=$3";
    }
    return "UPDATE matches SET coeff_1=coeff_1 || " + coeffCrawled_1 + ",\n                               coeff_2=coeff_2 || " + coeffCrawled_2 + "\n                             WHERE teams_id_1=(SELECT id FROM teams WHERE name=$1)\n                               AND teams_id_2=(SELECT id FROM teams WHERE name=$2)\n                               AND date=$3";
}
exports.updateMatchQ = updateMatchQ;
function updateAbbreviationQ(id, abbreviation) {
    return "UPDATE teams SET abbreviation=$1 WHERE id=" + id + " AND abbreviation IS NULL";
}
exports.updateAbbreviationQ = updateAbbreviationQ;
function updateMatchDateQ(id, date) {
    return "UPDATE matches SET date=$1 WHERE id=" + id;
}
exports.updateMatchDateQ = updateMatchDateQ;
