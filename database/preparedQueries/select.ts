import {QueryConfig} from "pg";
import {
    selectAllLeaguesQ,
    selectLeaguesQ, selectMatchByAbbrevQ,
    selectMatchByFLQ,
    selectMatchByStatusQ,
    selectMatchQ
} from "../queries/select";
import {MatchCrawled} from "../../typings/crawler";
import {MatchSearch} from "../../typings/server";

export function selectAllleaguesPQ(): QueryConfig {
    return {
        text: selectAllLeaguesQ()
    }
}

export function selectLeaguesPQ(name?: string): QueryConfig {
    return {
        text: selectLeaguesQ(),
        values: [name]
    }
}

export function selectMatchByAbbrevPQ(match: MatchSearch): QueryConfig {
    const {sport, league, date, team_1_abbreviation, team_2_abbreviation, score_1, score_2}: MatchSearch = match;
    return {
        text: selectMatchByAbbrevQ(),
        values: [sport, league, date, team_1_abbreviation, team_2_abbreviation, score_1, score_2]
    }
}


export function selectMatchByFLPQ(match: MatchSearch): QueryConfig {
    const {sport, league, date, team_1, team_2, score_1, score_2}: MatchSearch = match;
    return {
        text: selectMatchByFLQ(),
        values: [sport, league, date, team_1[0] + "%", team_2[0] + "%", score_1, score_2]
    }
}

export function selectMatchPQ(matchCrawled: MatchCrawled): QueryConfig {
    const {teamCrawled_1, teamCrawled_2} = matchCrawled;
    return {
        text: selectMatchQ(matchCrawled),
        values: [teamCrawled_1, teamCrawled_2]
    }
}

export function selectMatchByStatusPQ(league: string, status: string = "finished"): QueryConfig{
    return {
        text: selectMatchByStatusQ(),
        values: [status, league]
    }
}
