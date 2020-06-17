"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportsTableQ = "CREATE TABLE IF NOT EXISTS sports(\n                                                               id serial primary key,\n                                                               name varchar(100),\n                                                               unique(name)\n                                                               )";
exports.createLeaguesTableQ = "CREATE TABLE IF NOT EXISTS leagues(\n                                                                id serial primary key,\n                                                                name varchar(100),\n                                                                unique(name),\n                                                                url varchar,\n                                                                sports_id integer not null references sports(id)\n                                                                )";
exports.createTeamsTableQ = "CREATE TABLE IF NOT EXISTS teams(\n                                                                id serial primary key,\n                                                                name varchar(200),\n                                                                sports_id integer not null references sports(id),\n                                                                leagues_id integer not null references leagues(id),\n                                                                abbreviation varchar(100),\n                                                                other_names varchar(200) ARRAY\n                                                                )";
exports.createSeasonTableQ = "CREATE TABLE IF NOT EXISTS seasons(\n                                                            id serial primary key,\n                                                            name varchar(200),\n                                                            sports_id integer not null references sports(id),\n                                                            leagues_id integer not null references leagues(id)\n                                                            )";
exports.createStatusTableQ = "CREATE TABLE IF NOT EXISTS status(\n                                                            id serial primary key,\n                                                            name varchar(200),\n                                                            other_name varchar(200)\n                                                            )";
exports.createMatchesTableQ = "CREATE TABLE IF NOT EXISTS matches(\n                                                                id serial primary key,\n                                                                sports_id integer not null references sports(id),\n                                                                leagues_id integer not null references leagues(id),\n                                                                seasons_id integer not null references seasons(id),\n                                                                status_id integer not null references status(id),\n                                                                teams_id_1 integer not null references teams(id),\n                                                                teams_id_2 integer not null references teams(id),\n                                                                url varchar,\n                                                                date timestamp with time zone,\n                                                                score_1 integer,\n                                                                score_2 integer,\n                                                                coeff_1 decimal ARRAY,\n                                                                coeff_2 decimal ARRAY\n                                                                )";
exports.createFunctionSelectOrInsertSeason = "CREATE OR REPLACE FUNCTION \n            select_or_insert_season(var_name varchar(100), var_sports_id integer, var_leagues_id integer)\n            RETURNS integer AS\n            $BODY$\n            DECLARE result_id integer;\n            BEGIN\n                SELECT id FROM seasons WHERE name=var_name AND sports_id=var_sports_id AND leagues_id=var_leagues_id\n                       INTO result_id;\n                IF result_id IS NULL\n                THEN\n                    INSERT INTO seasons(name, sports_id, leagues_id) VALUES (var_name, var_sports_id, var_leagues_id) \n                           RETURNING id INTO result_id;\n                END IF;\n                RETURN result_id;\n            END $BODY$ LANGUAGE plpgsql;";
function createFunctionInsertMatch(matchDB) {
    var var_match = Object.keys(matchDB).map(function (key) {
        if (key.includes("date")) {
            return "var_" + key + " timestamp with time zone";
        }
        if (typeof matchDB[key] === "string") {
            return "var_" + key + " varchar";
        }
        return "var_" + key + " numeric";
    }).join(", ");
    var columns_match = Object.keys(matchDB).join(", ");
    var values_match = Object.keys(matchDB).map(function (key) {
        if (key.includes("coeff")) {
            return "ARRAY[var_" + key + "]";
        }
        return "var_" + key;
    }).join(", ");
    return "CREATE OR REPLACE FUNCTION\n                insert_match(\n                var_sports_id integer,\n                var_leagues_id integer,\n                var_seasons_id integer,\n                var_status varchar,\n                var_team_1 varchar,\n                var_team_2 varchar,\n                " + var_match + "\n                )\n            RETURNS void AS\n            $BODY$\n            DECLARE var_teams_id_1 integer; var_teams_id_2 integer; var_status_id integer;\n            BEGIN\n                SELECT id FROM teams WHERE sports_id=var_sports_id\n                                                  AND leagues_id=var_leagues_id\n                                                  AND UPPER(name)=UPPER(var_team_1) \n                                                  INTO var_teams_id_1;\n                SELECT id FROM teams WHERE sports_id=var_sports_id\n                                                  AND leagues_id=var_leagues_id\n                                                  AND UPPER(name)=UPPER(var_team_2) \n                                                  INTO var_teams_id_2;\n                SELECT id FROM status WHERE UPPER(name)=UPPER(var_status) INTO var_status_id;\n                IF var_teams_id_1 IS NULL \n                THEN\n                    INSERT INTO teams(sports_id, leagues_id, name) \n                                VALUES(var_sports_id, var_leagues_id, var_team_1) \n                                RETURNING id INTO var_teams_id_1;\n                END IF;\n                IF var_teams_id_2 IS NULL\n                THEN\n                    INSERT INTO teams(sports_id, leagues_id, name) \n                                VALUES(var_sports_id, var_leagues_id, var_team_2)\n                                RETURNING id INTO var_teams_id_2;\n                END IF;\n                IF var_status_id IS NULL\n                THEN\n                    INSERT INTO status(name) VALUES(var_status) RETURNING id INTO var_status_id;\n                END IF;\n                INSERT INTO matches (\n                                    sports_id,\n                                    leagues_id,\n                                    seasons_id,\n                                    status_id,\n                                    teams_id_1,\n                                    teams_id_2,\n                                    " + columns_match + ")\n                            VALUES  (\n                                    var_sports_id,\n                                    var_leagues_id,\n                                    var_seasons_id,\n                                    var_status_id,\n                                    var_teams_id_1,\n                                    var_teams_id_2,\n                                    " + values_match + ");\n            END $BODY$ LANGUAGE plpgsql;";
}
exports.createFunctionInsertMatch = createFunctionInsertMatch;
