"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMatchDatePQ = exports.updateAbbreviationPQ = exports.updateMatchPQ = void 0;
const update_1 = require("../queries/update");
function updateMatchPQ(matchCrawled) {
    const { teamCrawled_1, teamCrawled_2, dateCrawled } = matchCrawled;
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
