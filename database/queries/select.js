"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function selectLeaguesQ() {
    return "SELECT id, sports_id, url, name FROM leagues where UPPER(name)=UPPER($1)";
}
exports.selectLeaguesQ = selectLeaguesQ;
function selectMatchQ(_a) {
    var dateCrawled = _a.dateCrawled;
    return "SELECT t1.name AS team_1, t2.name AS team_2, score_1, score_2, coeff_1, coeff_2\n                                    FROM matches\n                                    INNER JOIN teams AS t1 ON matches.teams_id_1=t1.id\n                                    INNER JOIN teams AS t2 ON matches.teams_id_2=t2.id \n                                    WHERE UPPER(t1.name)=UPPER($1) \n                                    AND UPPER(t2.name)=UPPER($2)\n                                    AND date='" + dateCrawled + "'";
}
exports.selectMatchQ = selectMatchQ;
function selectMatchByStatusQ() {
    return "SELECT matches.id, t1.name as team_1, t2.name as team_2, date\n                       FROM matches \n                       INNER JOIN teams as t1 ON matches.teams_id_1=t1.id\n                       INNER JOIN teams as t2 ON matches.teams_id_2=t2.id\n                       WHERE status_id=(SELECT id FROM status WHERE UPPER(status.name)=UPPER($1)) \n                       ORDER BY date DESC LIMIT 1";
}
exports.selectMatchByStatusQ = selectMatchByStatusQ;
function selectMatchByFLQ(match) {
    var date = match.date, score_1 = match.score_1, score_2 = match.score_2;
    return "SELECT matches.id, t1.name AS team_1, teams_id_1, t2.name AS team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2\n                                  FROM matches\n                                  INNER JOIN teams as t1 ON matches.teams_id_1=t1.id\n                                  INNER JOIN teams as t2 ON matches.teams_id_2=t2.id\n                                  WHERE matches.sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER($1))\n                                  AND matches.leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER($2))\n                                  AND ((date >= '" + date + "'::timestamp with time zone AND date <= ('" + date + "'::timestamp with time zone + '1 day'::interval))\n                                        OR \n                                       (date <= '" + date + "'::timestamp with time zone AND date >= ('" + date + "'::timestamp with time zone - '1 day'::interval)))\n                                  AND ((t1.name LIKE $3\n                                       AND t2.name LIKE $4\n                                       AND score_1=" + score_1 + "\n                                       AND score_2=" + score_2 + ")\n                                       OR \n                                       (t1.name LIKE $3\n                                       AND t2.name LIKE $4\n                                       AND score_1=" + score_2 + "\n                                       AND score_2=" + score_1 + "))";
}
exports.selectMatchByFLQ = selectMatchByFLQ;
function selectOrInsertSeason(name, sports_id, leagues_id) {
    return "SELECT select_or_insert_season('" + name + "', " + sports_id + ", " + leagues_id + ") AS id";
}
exports.selectOrInsertSeason = selectOrInsertSeason;
