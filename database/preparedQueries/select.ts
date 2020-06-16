import {MatchCrawled, MatchSearchFL} from "../../typings";
import {QueryConfig} from "pg";
import {selectLeaguesQ, selectMatchByFLQ, selectMatchByStatusQ, selectMatchQ} from "../queries/select";

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

export function selectMatchByStatusPQ(status: string = "finished"): QueryConfig{
    return {
        text: selectMatchByStatusQ(),
        values: [status]
    }
}
