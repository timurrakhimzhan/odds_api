"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function selectLeaguesQ(name) {
    if (name) {
        return "SELECT id, sports_id, url, name FROM leagues where UPPER(name)=UPPER('" + name + "')";
    }
    return "SELECT id, sports_id, url, name FROM leagues";
}
exports.selectLeaguesQ = selectLeaguesQ;
function selectMatchQ(_a) {
    var teamCrawled_1 = _a.teamCrawled_1, teamCrawled_2 = _a.teamCrawled_2, dateCrawled = _a.dateCrawled;
    return "SELECT t1.name AS team_1, t2.name AS team_2, score_1, score_2, coeff_1, coeff_2\n                                    FROM matches\n                                    INNER JOIN teams AS t1 ON matches.teams_id_1=t1.id\n                                    INNER JOIN teams AS t2 ON matches.teams_id_2=t2.id \n                                    WHERE UPPER(t1.name)=UPPER('" + teamCrawled_1 + "') \n                                    AND UPPER(t2.name)=UPPER('" + teamCrawled_2 + "')\n                                    AND date='" + dateCrawled + "'";
}
exports.selectMatchQ = selectMatchQ;
function selectTeamQ(team) {
    return "SELECT id FROM teams WHERE UPPER(name)=UPPER('" + team + "')";
}
exports.selectTeamQ = selectTeamQ;
function selectMatchByStatusQ(status) {
    if (status === void 0) { status = "finished"; }
    return "SELECT matches.id, t1.name as team_1, t2.name as team_2, date\n                       FROM matches \n                       INNER JOIN teams as t1 ON matches.teams_id_1=t1.id\n                       INNER JOIN teams as t2 ON matches.teams_id_2=t2.id\n                       WHERE UPPER(status)=UPPER('" + status + "') \n                       ORDER BY date DESC LIMIT 1";
}
exports.selectMatchByStatusQ = selectMatchByStatusQ;
function selectMatchByFL(match) {
    var team_1 = match.team_1, team_2 = match.team_2, date = match.date, league = match.league, score_1 = match.score_1, score_2 = match.score_2, sport = match.sport;
    return "SELECT matches.id, t1.name AS team_1, teams_id_1, t2.name AS team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2\n                                  FROM matches\n                                  INNER JOIN teams as t1 ON matches.teams_id_1=t1.id\n                                  INNER JOIN teams as t2 ON matches.teams_id_2=t2.id\n                                  WHERE matches.sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER('" + sport + "'))\n                                  AND matches.leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER('" + league + "'))\n                                  AND ((date >= '" + date + "'::timestamp with time zone AND date <= ('" + date + "'::timestamp with time zone + '1 day'::interval))\n                                        OR \n                                       (date <= '" + date + "'::timestamp with time zone AND date >= ('" + date + "'::timestamp with time zone - '1 day'::interval)))\n                                  AND ((t1.name LIKE '" + team_1[0] + "%' \n                                       AND t2.name LIKE '" + team_2[0] + "%'\n                                       AND score_1=" + score_1 + "\n                                       AND score_2=" + score_2 + ")\n                                       OR \n                                       (t1.name LIKE '" + team_2[0] + "%'\n                                       AND t2.name LIKE '" + team_1[0] + "%'\n                                       AND score_1=" + score_2 + "\n                                       AND score_2=" + score_1 + "))";
}
exports.selectMatchByFL = selectMatchByFL;
function selectOrInsertSeason(name, sports_id, leagues_id) {
    return "SELECT select_or_insert_season('" + name + "', " + sports_id + ", " + leagues_id + ") AS id";
}
exports.selectOrInsertSeason = selectOrInsertSeason;
