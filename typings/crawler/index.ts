export interface MatchCrawled {
    dateCrawled: string,
    teamCrawled_1: string,
    teamCrawled_2: string,
    urlCrawled: string,
    coeffCrawled_1: number,
    coeffCrawled_2: number,
    scoreCrawled_1: number,
    scoreCrawled_2: number,
}

export interface MatchDBQuery {
    date: string,
    url: string,
    coeff_1: Array<number> | number,
    coeff_2: Array<number> | number,
    score_1: number,
    score_2: number,

    [key: string]: any
}