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
                                                                name varchar(100),
                                                                sports_id integer not null references sports(id),
                                                                leagues_id integer not null references leagues(id),
                                                                abbreviation varchar(100),
                                                                other_names varchar(100) ARRAY
                                                                )`;

export const createMatchesTableQ: string = `CREATE TABLE IF NOT EXISTS matches(
                                                                id serial primary key,
                                                                teams_id_1 integer not null references teams(id),
                                                                teams_id_2 integer not null references teams(id),
                                                                team_1 varchar,
                                                                team_2 varchar,
                                                                url varchar,
                                                                status varchar,
                                                                date timestamp with time zone,
                                                                score_1 integer,
                                                                score_2 integer,
                                                                coeff_1 decimal ARRAY,
                                                                coeff_2 decimal ARRAY,
                                                                season varchar,
                                                                leagues_id integer not null references leagues(id),
                                                                sports_id integer not null references sports(id)
                                                                )`;