import {MatchCrawled} from "../../typings";

export function updateMatchQ(matchCrawled: MatchCrawled) {
    let {teamCrawled_1, teamCrawled_2, scoreCrawled_1, scoreCrawled_2, coeffCrawled_1, coeffCrawled_2, dateCrawled} = matchCrawled;
    if(scoreCrawled_1 && scoreCrawled_2) {
        return `UPDATE matches SET coeff_1=coeff_1 || ${coeffCrawled_1},
                               coeff_2=coeff_2 || ${coeffCrawled_2},
                               score_1=${scoreCrawled_1},
                               score_2=${scoreCrawled_2},
                               status='finished'
                             WHERE UPPER(team_1)=UPPER('${teamCrawled_1}')
                               AND UPPER(team_2)=UPPER('${teamCrawled_2}')
                               AND date='${dateCrawled}'`;
    }
    return `UPDATE matches SET coeff_1=coeff_1 || ${coeffCrawled_1},
                               coeff_2=coeff_2 || ${coeffCrawled_2}
                             WHERE UPPER(team_1)=UPPER('${teamCrawled_1}') 
                               AND UPPER(team_2)=UPPER('${teamCrawled_2}')
                               AND date='${dateCrawled}'`;
}

export function updateAbbreviationQ(id: number, abbreviation: string) {
    return `UPDATE teams SET abbreviation='${abbreviation}' WHERE id=${id} AND abbreviation IS NULL`;
}
export function updateMatchDateQ(id: number, date: string) {
    return `UPDATE matches SET date='${date}' WHERE id=${id}`;
}