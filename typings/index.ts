export interface League {
    id: number,
    name: string,
    url: string,
    sports_id: number
}

export interface MatchCrawled {
    dateCrawled: string,
    teamCrawled_1: string,
    teamCrawled_2: string,
    urlCrawled: string,
    coeffCrawled_1: number,
    coeffCrawled_2: number,
    scoreCrawled_1?: number,
    scoreCrawled_2?: number,
}

export interface MatchDB {
    id?: number,
    date: string,
    teams_id_1?: number,
    team_1 ?: string,
    team_2 ?: string,
    teams_id_2?: number,
    url: string,
    coeff_1: Array<number> | number,
    coeff_2: Array<number> | number,
    score_1?: number,
    score_2?: number,
    leagues_id: number,
    sports_id: number,
    seasons_id: number
}

export interface MatchSearchFL {
    team_1: string,
    team_2: string,
    sport: string,
    league: string,
    date: string,
    score_1: string,
    score_2: string,
}
export interface Query {
    [key: string]: string
}