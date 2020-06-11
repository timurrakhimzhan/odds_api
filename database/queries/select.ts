import {MatchCrawled, MatchSearchFL} from "../../typings";

export function selectLeaguesQ(name?: string) {
    if(name) {
        return `SELECT id, sports_id, url, name FROM leagues where UPPER(name)=UPPER('${name}')`;
    }
    return `SELECT id, sports_id, url, name FROM leagues`;
}

export function selectMatchQ({teamCrawled_1, teamCrawled_2, dateCrawled}: MatchCrawled) {
    return `SELECT t1.name AS team_1, t2.name AS team_2, score_1, score_2, coeff_1, coeff_2
                                    FROM matches
                                    INNER JOIN teams AS t1 ON matches.teams_id_1=t1.id
                                    INNER JOIN teams AS t2 ON matches.teams_id_2=t2.id 
                                    WHERE UPPER(t1.name)=UPPER('${teamCrawled_1}') 
                                    AND UPPER(t2.name)=UPPER('${teamCrawled_2}')
                                    AND date='${dateCrawled}'`;
}

export function selectTeamQ(team: string) {
    return `SELECT id FROM teams WHERE UPPER(name)=UPPER('${team}')`;
}

export function selectMatchByStatusQ(status: string = "finished"): string {
    return `SELECT matches.id, t1.name as team_1, t2.name as team_2, date
                       FROM matches 
                       INNER JOIN teams as t1 ON matches.teams_id_1=t1.id
                       INNER JOIN teams as t2 ON matches.teams_id_2=t2.id
                       WHERE UPPER(status)=UPPER('${status}') 
                       ORDER BY date DESC LIMIT 1`;
}

export function selectMatchByFL(match: MatchSearchFL) {
    const {team_1, team_2, date, league, score_1, score_2, sport} = match;
    return `SELECT matches.id, t1.name AS team_1, teams_id_1, t2.name AS team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2
                                  FROM matches
                                  INNER JOIN teams as t1 ON matches.teams_id_1=t1.id
                                  INNER JOIN teams as t2 ON matches.teams_id_2=t2.id
                                  WHERE matches.sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER('${sport}'))
                                  AND matches.leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER('${league}'))
                                  AND ((date >= '${date}'::timestamp with time zone AND date <= ('${date}'::timestamp with time zone + '1 day'::interval))
                                        OR 
                                       (date <= '${date}'::timestamp with time zone AND date >= ('${date}'::timestamp with time zone - '1 day'::interval)))
                                  AND ((t1.name LIKE '${team_1[0]}%' 
                                       AND t2.name LIKE '${team_2[0]}%'
                                       AND score_1=${score_1}
                                       AND score_2=${score_2})
                                       OR 
                                       (t1.name LIKE '${team_2[0]}%'
                                       AND t2.name LIKE '${team_1[0]}%'
                                       AND score_1=${score_2}
                                       AND score_2=${score_1}))`
}

export function selectOrInsertSeason(name: string, sports_id: number, leagues_id: number) {
    return `SELECT select_or_insert_season('${name}', ${sports_id}, ${leagues_id}) AS id`;
}