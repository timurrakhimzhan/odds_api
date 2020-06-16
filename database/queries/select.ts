import {MatchCrawled, MatchSearchFL} from "../../typings";

export function selectLeaguesQ() {
    return `SELECT id, sports_id, url, name FROM leagues where UPPER(name)=UPPER($1)`;

}

export function selectMatchQ({dateCrawled}: MatchCrawled) {
    return `SELECT t1.name AS team_1, t2.name AS team_2, score_1, score_2, coeff_1, coeff_2
                                    FROM matches
                                    INNER JOIN teams AS t1 ON matches.teams_id_1=t1.id
                                    INNER JOIN teams AS t2 ON matches.teams_id_2=t2.id 
                                    WHERE UPPER(t1.name)=UPPER($1) 
                                    AND UPPER(t2.name)=UPPER($2)
                                    AND date='${dateCrawled}'`;
}


export function selectMatchByStatusQ(): string {
    return `SELECT matches.id, t1.name as team_1, t2.name as team_2, date
                       FROM matches 
                       INNER JOIN teams as t1 ON matches.teams_id_1=t1.id
                       INNER JOIN teams as t2 ON matches.teams_id_2=t2.id
                       WHERE UPPER(status)=UPPER($1) 
                       ORDER BY date DESC LIMIT 1`;
}

export function selectMatchByFLQ(match: MatchSearchFL) {
    const {date, score_1, score_2} = match;
    return `SELECT matches.id, t1.name AS team_1, teams_id_1, t2.name AS team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2
                                  FROM matches
                                  INNER JOIN teams as t1 ON matches.teams_id_1=t1.id
                                  INNER JOIN teams as t2 ON matches.teams_id_2=t2.id
                                  WHERE matches.sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER($1))
                                  AND matches.leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER($2))
                                  AND ((date >= '${date}'::timestamp with time zone AND date <= ('${date}'::timestamp with time zone + '1 day'::interval))
                                        OR 
                                       (date <= '${date}'::timestamp with time zone AND date >= ('${date}'::timestamp with time zone - '1 day'::interval)))
                                  AND ((t1.name LIKE $3
                                       AND t2.name LIKE $4
                                       AND score_1=${score_1}
                                       AND score_2=${score_2})
                                       OR 
                                       (t1.name LIKE $3
                                       AND t2.name LIKE $4
                                       AND score_1=${score_2}
                                       AND score_2=${score_1}))`
}

export function selectOrInsertSeason(name: string, sports_id: number, leagues_id: number) {
    return `SELECT select_or_insert_season('${name}', ${sports_id}, ${leagues_id}) AS id`;
}