"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertSportsRowQ(sportName) {
    return "INSERT INTO sports (name) VALUES ('" + sportName + "')";
}
exports.insertSportsRowQ = insertSportsRowQ;
function insertLeagueRowQ(sport, leagueName, url) {
    return "INSERT INTO leagues (name, url, sports_id) VALUES \n                                                        (\n                                                        '" + leagueName + "',\n                                                        '" + url + "',\n                                                        (SELECT id FROM sports WHERE UPPER(name)=UPPER('" + sport + "'))\n                                                        )";
}
exports.insertLeagueRowQ = insertLeagueRowQ;
function insertTeamRowQ(team, sports_id, leagues_id) {
    return "INSERT INTO teams (name, sports_id, leagues_id) VALUES ('" + team + "', " + sports_id + ", " + leagues_id + ")";
}
exports.insertTeamRowQ = insertTeamRowQ;
function insertMatchRowQ(team_1, team_2, matchDB) {
    var keys = Object.keys(matchDB);
    var values = Object.values(matchDB);
    var status = "finished";
    if (!matchDB.score_1 || !matchDB.score_2 || isNaN(matchDB.score_1) || isNaN(matchDB.score_2)) {
        values = values.filter(function (value, i) { return !keys[i].includes("score"); });
        keys = keys.filter(function (key) { return !key.includes("score"); });
        status = "progress";
    }
    var insertValues = values.map(function (value, i) {
        if (isNaN(value))
            return "'" + value + "'";
        if (keys[i].includes("coeff")) {
            return "ARRAY[" + value + "]";
        }
        return value;
    }).join(", ");
    var insertQuery = "INSERT INTO matches (" + keys.join(", ") + ", status, teams_id_1, teams_id_2)\n                                     VALUES (" + insertValues + ", '" + status + "', var_teams_id_1, var_teams_id_2)";
    return "DO $$\n            DECLARE var_teams_id_1 integer; var_teams_id_2 integer;\n            BEGIN\n                SELECT id FROM teams WHERE sports_id=" + matchDB.sports_id + "\n                                                  AND leagues_id=" + matchDB.leagues_id + "\n                                                  AND name='" + team_1 + "' into var_teams_id_1;\n                SELECT id FROM teams WHERE sports_id=" + matchDB.sports_id + "\n                                                  AND leagues_id=" + matchDB.leagues_id + "\n                                                  AND name='" + team_2 + "' into var_teams_id_2;\n                IF var_teams_id_1 IS NULL \n                THEN\n                    INSERT INTO teams(sports_id, leagues_id, name) \n                                VALUES(" + matchDB.sports_id + ", " + matchDB.leagues_id + ", '" + team_1 + "') \n                                RETURNING id INTO var_teams_id_1;\n                END IF;\n                IF var_teams_id_2 IS NULL\n                THEN\n                    INSERT INTO teams(sports_id, leagues_id, name) \n                                VALUES(" + matchDB.sports_id + ", " + matchDB.leagues_id + ", '" + team_2 + "')\n                                RETURNING id INTO var_teams_id_2;\n                END IF;\n                " + insertQuery + ";\n            END $$";
}
exports.insertMatchRowQ = insertMatchRowQ;
