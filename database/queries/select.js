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
    return "SELECT team_1, team_2, score_1, score_2, coeff_1, coeff_2\n                                    FROM matches WHERE UPPER(team_1)=UPPER('" + teamCrawled_1 + "') \n                                    AND UPPER(team_2)=UPPER('" + teamCrawled_2 + "')\n                                    AND date='" + dateCrawled + "'";
}
exports.selectMatchQ = selectMatchQ;
function selectTeamQ(team) {
    return "SELECT id FROM teams WHERE UPPER(name)=UPPER('" + team + "')";
}
exports.selectTeamQ = selectTeamQ;
function selectMatchByStatusQ(status) {
    if (status === void 0) { status = "finished"; }
    return "SELECT id, team_1, team_2, date\n                       FROM matches WHERE UPPER(status)=UPPER('" + status + "') ORDER BY date DESC LIMIT 1";
}
exports.selectMatchByStatusQ = selectMatchByStatusQ;
function selectMatchByFL(match) {
    var team_1 = match.team_1, team_2 = match.team_2, date = match.date, league = match.league, score_1 = match.score_1, score_2 = match.score_2, sport = match.sport;
    return "SELECT id, team_1, teams_id_1, team_2, teams_id_2, date, score_1, score_2, coeff_1, coeff_2\n                                  FROM matches WHERE sports_id=(SELECT id FROM sports WHERE UPPER(name)=UPPER('" + sport + "'))\n                                  AND leagues_id=(SELECT id FROM leagues WHERE UPPER(name)=UPPER('" + league + "'))\n                                  AND ((date >= '" + date + "'::timestamp with time zone AND date <= ('" + date + "'::timestamp with time zone + '1 day'::interval))\n                                        OR \n                                       (date <= '" + date + "'::timestamp with time zone AND date >= ('" + date + "'::timestamp with time zone - '1 day'::interval)))\n                                  AND ((team_1 LIKE '" + team_1[0] + "%' \n                                       AND team_2 LIKE '" + team_2[0] + "%'\n                                       AND score_1=" + score_1 + "\n                                       AND score_2=" + score_2 + ")\n                                       OR \n                                       (team_1 LIKE '" + team_2[0] + "%'\n                                       AND team_2 LIKE '" + team_1[0] + "%'\n                                       AND score_1=" + score_2 + "\n                                       AND score_2=" + score_1 + "))";
}
exports.selectMatchByFL = selectMatchByFL;
