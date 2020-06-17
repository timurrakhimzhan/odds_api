import {League, MatchDBQuery} from "../../typings";
import {QueryConfig} from "pg";
import {insertLeagueRowQ, insertMatchRowQ, insertSportsRowQ} from "../queries/insert";


export function insertLeagueRowPQ(sport: string, leagueName: string, url: string): QueryConfig {
    return {
        text: insertLeagueRowQ(),
        values: [leagueName, url, sport]
    }
}

export function insertSportsRowPQ(sportName: string): QueryConfig {
    return {
        text: insertSportsRowQ(),
        values: [sportName]
    }
}

export function insertMatchRowPQ(team_1: string, team_2: string, league: League, season_id: number,  matchDB: MatchDBQuery): QueryConfig {
    const {score_1, score_2}: MatchDBQuery = matchDB;
    let status: string = "finished";
    if(isNaN(score_1) || isNaN(score_2)) {
        status = "progress"
    }
    return {
        text: insertMatchRowQ(league, season_id, matchDB),
        values: [team_1, team_2, status]
    }
}