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