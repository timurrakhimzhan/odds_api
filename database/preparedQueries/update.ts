import {MatchCrawled} from "../../typings";
import {QueryConfig} from "pg";
import {updateAbbreviationQ, updateMatchDateQ, updateMatchQ} from "../queries/update";

export function updateMatchPQ(matchCrawled: MatchCrawled): QueryConfig {
    const {teamCrawled_1, teamCrawled_2, dateCrawled}: MatchCrawled = matchCrawled;
    return {
        text: updateMatchQ(matchCrawled),
        values: [teamCrawled_1, teamCrawled_2, dateCrawled]
    }
}

export function updateAbbreviationPQ(id: number, abbreviation: string): QueryConfig {
    return {
        text: updateAbbreviationQ(id, abbreviation),
        values: [abbreviation]
    }
}

export function updateMatchDatePQ(id: number, date: string) {
    return {
        text: updateMatchDateQ(id, date),
        values: [date]
    }
}