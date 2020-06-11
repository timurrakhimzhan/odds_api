import {MatchDB} from "../../typings";

export function insertSportsRowQ(sportName: string): string {
    return `INSERT INTO sports (name) VALUES ('${sportName}')`;
}

export function insertLeagueRowQ(sport: string, leagueName: string, url: string): string {
    return `INSERT INTO leagues (name, url, sports_id) VALUES 
                                                        (
                                                        '${leagueName}',
                                                        '${url}',
                                                        (SELECT id FROM sports WHERE UPPER(name)=UPPER('${sport}'))
                                                        )`;
}

export function insertTeamRowQ(team: string, sports_id: number, leagues_id: number) {
    return `INSERT INTO teams (name, sports_id, leagues_id) VALUES ('${team}', ${sports_id}, ${leagues_id})`;
}

export function insertMatchRowQ(team_1: string, team_2: string, matchDB: MatchDB): string{
    let keys: Array<string> = Object.keys(matchDB);
    let values: Array<any> = Object.values(matchDB);
    let status: string = "finished";

    if(!matchDB.score_1 || !matchDB.score_2 || isNaN(matchDB.score_1) || isNaN(matchDB.score_2)) {
        values = values.filter((value, i) => !keys[i].includes("score"));
        keys = keys.filter((key) => !key.includes("score"));
        status = "progress";
    }

    const insertValues = values.map((value, i) => {
        if(isNaN(value))
            return `'${value}'`;
        if(keys[i].includes("coeff")) {
            return `ARRAY[${value}]`;
        }
        return value;
    }).join(", ");

    const insertQuery = `INSERT INTO matches (${keys.join(", ")}, status, teams_id_1, teams_id_2)
                                     VALUES (${insertValues}, '${status}', var_teams_id_1, var_teams_id_2)`;

    return `DO $$
            DECLARE var_teams_id_1 integer; var_teams_id_2 integer;
            BEGIN
                SELECT id FROM teams WHERE sports_id=${matchDB.sports_id}
                                                  AND leagues_id=${matchDB.leagues_id}
                                                  AND name='${team_1}' into var_teams_id_1;
                SELECT id FROM teams WHERE sports_id=${matchDB.sports_id}
                                                  AND leagues_id=${matchDB.leagues_id}
                                                  AND name='${team_2}' into var_teams_id_2;
                IF var_teams_id_1 IS NULL 
                THEN
                    INSERT INTO teams(sports_id, leagues_id, name) 
                                VALUES(${matchDB.sports_id}, ${matchDB.leagues_id}, '${team_1}') 
                                RETURNING id INTO var_teams_id_1;
                END IF;
                IF var_teams_id_2 IS NULL
                THEN
                    INSERT INTO teams(sports_id, leagues_id, name) 
                                VALUES(${matchDB.sports_id}, ${matchDB.leagues_id}, '${team_2}')
                                RETURNING id INTO var_teams_id_2;
                END IF;
                ${insertQuery};
            END $$`;

}
