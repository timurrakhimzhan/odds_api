import {MatchCrawled, MatchSearchFL} from "../../typings";

export function selectLeaguesQ(name?: string) {
    if(name) {
        return `SELECT id, sports_id, url, name FROM leagues where UPPER(name)=UPPER('${name}')`;
    }
    return `SELECT id, sports_id, url, name FROM leagues`;
}

export function selectMatchQ({teamCrawled_1, teamCrawled_2, dateCrawled}: MatchCrawled) {
    return `SELECT team_1, team_2, score_1, score_2, coeff_1, coeff_2
                                    FROM matches WHERE UPPER(team_1)=UPPER('${teamCrawled_1}') 
                                    AND UPPER(team_2)=UPPER('${teamCrawled_2}')
                                    AND date='${dateCrawled}'`;
}

export function selectTeamQ(team: string) {
    return `SELECT id FROM teams WHERE UPPER(name)=UPPER('${team}')`;
}

export function selectMatchByStatusQ(status: string = "finished"): string {
    return `SELECT id, team_1, team_2, date
                       FROM matches WHERE UPPER(status)=UPPER('${status}') ORDER BY date DESC LIMIT 1`;
}

export function selectMatchByFL(match: MatchSearchFL) {
    const {team_1, team_2, date, league, score_1, score_2, sport} = match;
    return `SELECT id, team_1, teams_id_1, team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2
                                  FROM matches WHERE sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER('${sport}'))
                                  AND leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER('${league}'))
                                  AND ((date >= '${date}'::timestamp with time zone AND date <= ('${date}'::timestamp with time zone + '1 day'::interval))
                                        OR 
                                       (date <= '${date}'::timestamp with time zone AND date >= ('${date}'::timestamp with time zone - '1 day'::interval)))
                                  AND ((team_1 LIKE '${team_1[0]}%' 
                                       AND team_2 LIKE '${team_2[0]}%'
                                       AND score_1=${score_1}
                                       AND score_2=${score_2})
                                       OR 
                                       (team_1 LIKE '${team_2[0]}%'
                                       AND team_2 LIKE '${team_1[0]}%'
                                       AND score_1=${score_2}
                                       AND score_2=${score_1}))`
}