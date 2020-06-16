import {MatchDBQuery} from "../../typings";

export const createSportsTableQ: string = `CREATE TABLE IF NOT EXISTS sports(
                                                               id serial primary key,
                                                               name varchar(100),
                                                               unique(name)
                                                               )`;
export const createLeaguesTableQ: string = `CREATE TABLE IF NOT EXISTS leagues(
                                                                id serial primary key,
                                                                name varchar(100),
                                                                unique(name),
                                                                url varchar,
                                                                sports_id integer not null references sports(id)
                                                                )`;

export const createTeamsTableQ: string = `CREATE TABLE IF NOT EXISTS teams(
                                                                id serial primary key,
                                                                name varchar(200),
                                                                sports_id integer not null references sports(id),
                                                                leagues_id integer not null references leagues(id),
                                                                abbreviation varchar(100),
                                                                other_names varchar(200) ARRAY
                                                                )`;

export const createSeasonTableQ: string= `CREATE TABLE IF NOT EXISTS seasons(
                                                            id serial primary key,
                                                            name varchar(200),
                                                            sports_id integer not null references sports(id),
                                                            leagues_id integer not null references leagues(id)
                                                            )`;

export const createMatchesTableQ: string = `CREATE TABLE IF NOT EXISTS matches(
                                                                id serial primary key,
                                                                teams_id_1 integer not null references teams(id),
                                                                teams_id_2 integer not null references teams(id),
                                                                url varchar,
                                                                status varchar,
                                                                date timestamp with time zone,
                                                                score_1 integer,
                                                                score_2 integer,
                                                                coeff_1 decimal ARRAY,
                                                                coeff_2 decimal ARRAY,
                                                                seasons_id integer not null references seasons(id),
                                                                leagues_id integer not null references leagues(id),
                                                                sports_id integer not null references sports(id)
                                                                )`;
export const createFunctionSelectOrInsertSeason: string = `CREATE OR REPLACE FUNCTION 
            select_or_insert_season(var_name varchar(100), var_sports_id integer, var_leagues_id integer)
            RETURNS integer AS
            $BODY$
            DECLARE result_id integer;
            BEGIN
                SELECT id FROM seasons WHERE name=var_name AND sports_id=var_sports_id AND leagues_id=var_leagues_id
                       INTO result_id;
                IF result_id IS NULL
                THEN
                    INSERT INTO seasons(name, sports_id, leagues_id) VALUES (var_name, var_sports_id, var_leagues_id) 
                           RETURNING id INTO result_id;
                END IF;
                RETURN result_id;
            END $BODY$ LANGUAGE plpgsql;`;


export function createFunctionInsertMatch(matchDB: MatchDBQuery): string{
    const var_match = Object.keys(matchDB).map((key) => {
        if(key.includes("date")) {
            return `var_${key} timestamp with time zone`
        }
        if(typeof matchDB[key] === "string") {
            return `var_${key} varchar`
        }
        return `var_${key} numeric`;
    }).join(", ");
    const columns_match = Object.keys(matchDB).join(", ");
    const values_match = Object.keys(matchDB).map((key) => {
        if(key.includes("coeff")) {
            return `ARRAY[var_${key}]`;
        }
        return "var_" + key;
    }).join(", ");
    return `CREATE OR REPLACE FUNCTION
                insert_match(
                var_sports_id integer,
                var_leagues_id integer,
                var_seasons_id integer,
                var_status varchar,
                var_team_1 varchar,
                var_team_2 varchar,
                ${var_match}
                )
            RETURNS void AS
            $BODY$
            DECLARE var_teams_id_1 integer; var_teams_id_2 integer;
            BEGIN
                SELECT id FROM teams WHERE sports_id=var_sports_id
                                                  AND leagues_id=var_leagues_id
                                                  AND UPPER(name)=UPPER(var_team_1) 
                                                  INTO var_teams_id_1;
                SELECT id FROM teams WHERE sports_id=var_sports_id
                                                  AND leagues_id=var_leagues_id
                                                  AND UPPER(name)=UPPER(var_team_2) 
                                                  INTO var_teams_id_2;
                IF var_teams_id_1 IS NULL 
                THEN
                    INSERT INTO teams(sports_id, leagues_id, name) 
                                VALUES(var_sports_id, var_leagues_id, var_team_1) 
                                RETURNING id INTO var_teams_id_1;
                END IF;
                IF var_teams_id_2 IS NULL
                THEN
                    INSERT INTO teams(sports_id, leagues_id, name) 
                                VALUES(var_sports_id, var_leagues_id, var_team_2)
                                RETURNING id INTO var_teams_id_2;
                END IF;
                INSERT INTO matches (
                                    sports_id,
                                    leagues_id,
                                    seasons_id,
                                    status,
                                    teams_id_1,
                                    teams_id_2,
                                    ${columns_match})
                            VALUES  (
                                    var_sports_id,
                                    var_leagues_id,
                                    var_seasons_id,
                                    var_status,
                                    var_teams_id_1,
                                    var_teams_id_2,
                                    ${values_match});
            END $BODY$ LANGUAGE plpgsql;`
}