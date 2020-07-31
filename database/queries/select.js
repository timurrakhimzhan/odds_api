"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectOrInsertSeason = exports.selectMatchByFLQ = exports.selectMatchByAbbrevQ = exports.selectMatchByStatusQ = exports.selectMatchQ = exports.selectLeaguesQ = exports.selectAllLeaguesQ = void 0;
function selectAllLeaguesQ() {
    return `SELECT id, sports_id, url, name FROM leagues`;
}
exports.selectAllLeaguesQ = selectAllLeaguesQ;
function selectLeaguesQ() {
    return `SELECT id, sports_id, url, name FROM leagues where UPPER(name)=UPPER($1)`;
}
exports.selectLeaguesQ = selectLeaguesQ;
function selectMatchQ({ dateCrawled }) {
    return `SELECT t1.name AS team_1, t2.name AS team_2, score_1, score_2, coeff_1, coeff_2
                                    FROM matches
                                    INNER JOIN teams AS t1 ON matches.teams_id_1=t1.id
                                    INNER JOIN teams AS t2 ON matches.teams_id_2=t2.id 
                                    WHERE UPPER(t1.name)=UPPER($1) 
                                    AND UPPER(t2.name)=UPPER($2)
                                    AND ((date >= '${dateCrawled}'::timestamp with time zone AND date <= ('${dateCrawled}'::timestamp with time zone + '1 day'::interval))
                                        OR 
                                       (date <= '${dateCrawled}'::timestamp with time zone AND date >= ('${dateCrawled}'::timestamp with time zone - '1 day'::interval)))`;
}
exports.selectMatchQ = selectMatchQ;
function selectMatchByStatusQ() {
    return `SELECT matches.id, t1.name as team_1, t2.name as team_2, date, score_1, score_2
                       FROM matches 
                       INNER JOIN teams as t1 ON matches.teams_id_1=t1.id
                       INNER JOIN teams as t2 ON matches.teams_id_2=t2.id
                       WHERE status_id=(SELECT id FROM status WHERE UPPER(status.name)=UPPER($1)) 
                       AND matches.leagues_id=(SELECT id FROM leagues WHERE UPPER(leagues.name)=UPPER($2))
                       ORDER BY date DESC LIMIT 1`;
}
exports.selectMatchByStatusQ = selectMatchByStatusQ;
function selectMatchByAbbrevQ() {
    return `SELECT matches.id, t1.name AS team_1, teams_id_1, t2.name AS team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2
                                  FROM matches
                                  INNER JOIN teams as t1 ON matches.teams_id_1=t1.id
                                  INNER JOIN teams as t2 ON matches.teams_id_2=t2.id
                                  WHERE matches.sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER($1))
                                  AND matches.leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER($2))
                                  AND ((date >= $3::timestamp with time zone AND date <= ($3::timestamp with time zone + '1 day'::interval))
                                        OR 
                                       (date <= $3::timestamp with time zone AND date >= ($3::timestamp with time zone - '1 day'::interval)))
                                  AND ((t1.abbreviation=$4
                                       AND t2.abbreviation=$5
                                       AND score_1=$6
                                       AND score_2=$7)
                                       OR 
                                       (t1.abbreviation=$5
                                       AND t2.abbreviation=$4
                                       AND score_1=$7
                                       AND score_2=$6))`;
}
exports.selectMatchByAbbrevQ = selectMatchByAbbrevQ;
function selectMatchByFLQ() {
    return `SELECT matches.id, t1.name AS team_1, teams_id_1, t2.name AS team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2
                                  FROM matches
                                  INNER JOIN teams as t1 ON matches.teams_id_1=t1.id
                                  INNER JOIN teams as t2 ON matches.teams_id_2=t2.id
                                  WHERE matches.sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER($1))
                                  AND matches.leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER($2))
                                  AND ((date >= $3::timestamp with time zone AND date <= ($3::timestamp with time zone + '1 day'::interval))
                                        OR 
                                       (date <= $3::timestamp with time zone AND date >= ($3::timestamp with time zone - '1 day'::interval)))
                                  AND ((t1.name LIKE $4
                                       AND t2.name LIKE $5
                                       AND score_1=$6
                                       AND score_2=$7)
                                       OR 
                                       (t1.name LIKE $5
                                       AND t2.name LIKE $4
                                       AND score_1=$7
                                       AND score_2=$6))`;
}
exports.selectMatchByFLQ = selectMatchByFLQ;
function selectOrInsertSeason(name, sports_id, leagues_id) {
    return `SELECT select_or_insert_season('${name}', ${sports_id}, ${leagues_id}) AS id`;
}
exports.selectOrInsertSeason = selectOrInsertSeason;
