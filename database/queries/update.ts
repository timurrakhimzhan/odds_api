import {MatchCrawled} from "../../typings/crawler";

export function updateMatchQ(matchCrawled: MatchCrawled) {
    let {scoreCrawled_1, scoreCrawled_2, coeffCrawled_1, coeffCrawled_2} = matchCrawled;
    if(scoreCrawled_1 && scoreCrawled_2) {
        return `UPDATE matches SET coeff_1=coeff_1 || ${coeffCrawled_1},
                               coeff_2=coeff_2 || ${coeffCrawled_2},
                               score_1=${scoreCrawled_1},
                               score_2=${scoreCrawled_2},
                               status='finished'
                             WHERE teams_id_1=(SELECT id FROM teams WHERE name=$1)
                               AND teams_id_2=(SELECT id FROM teams WHERE name=$2)
                               AND date=$3`;
    }
    return `UPDATE matches SET coeff_1=coeff_1 || ${coeffCrawled_1},
                               coeff_2=coeff_2 || ${coeffCrawled_2}
                             WHERE teams_id_1=(SELECT id FROM teams WHERE name=$1)
                               AND teams_id_2=(SELECT id FROM teams WHERE name=$2)
                               AND date=$3`;
}

export function updateAbbreviationQ(id: number, abbreviation: string) {
    return `UPDATE teams SET abbreviation=$1 WHERE id=${id} AND abbreviation IS NULL`;
}

export function updateMatchDateQ(id: number, date: string) {
    return `UPDATE matches SET date=$1 WHERE id=${id}`;
}

