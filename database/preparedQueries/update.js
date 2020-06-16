"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var update_1 = require("../queries/update");
function updateMatchPQ(matchCrawled) {
    var teamCrawled_1 = matchCrawled.teamCrawled_1, teamCrawled_2 = matchCrawled.teamCrawled_2, dateCrawled = matchCrawled.dateCrawled;
    return {
        text: update_1.updateMatchQ(matchCrawled),
        values: [teamCrawled_1, teamCrawled_2, dateCrawled]
    };
}
exports.updateMatchPQ = updateMatchPQ;
function updateAbbreviationPQ(id, abbreviation) {
    return {
        text: update_1.updateAbbreviationQ(id, abbreviation),
        values: [abbreviation]
    };
}
exports.updateAbbreviationPQ = updateAbbreviationPQ;
function updateMatchDatePQ(id, date) {
    return {
        text: update_1.updateMatchDateQ(id, date),
        values: [date]
    };
}
exports.updateMatchDatePQ = updateMatchDatePQ;
