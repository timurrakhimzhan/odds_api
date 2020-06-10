import {MatchDB} from "../../typings";

export function insertSportsRowQ(sportName: string): string {
    return `INSERT INTO sports (name) VALUES ('${sportName}')`;
}

export function insertLeagueRowQ(leagueName: string, url: string, sport: string): string {
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



export function insertMatchRowQ(matchDB: MatchDB): string{
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


    return `INSERT INTO matches (${keys.join(", ")}, status) VALUES (${insertValues}, '${status}')`;
}
