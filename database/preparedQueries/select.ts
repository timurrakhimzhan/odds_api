import {QueryConfig} from "pg";
import {
    selectAllLeaguesQ,
    selectLeaguesQ,
    selectMatchByFLQ,
    selectMatchByStatusQ,
    selectMatchQ
} from "../queries/select";
import {MatchCrawled} from "../../typings/crawler";
import {MatchSearchFL} from "../../typings/server";

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


export function selectMatchByFLPQ(match: MatchSearchFL): QueryConfig {
    const {sport, league, team_1, team_2}: MatchSearchFL = match;
    return {
        text: selectMatchByFLQ(match),
        values: [sport, league, team_1[0] + "%", team_2[0] + "%"]
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
