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
    return {
        text: insertMatchRowQ(league, season_id, matchDB),
        values: [team_1, team_2]
    }
}