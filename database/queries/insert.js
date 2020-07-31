"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMatchRowQ = exports.insertLeagueRowQ = exports.insertSportsRowQ = void 0;
function insertSportsRowQ() {
    return `INSERT INTO sports (name) VALUES ($1)`;
}
exports.insertSportsRowQ = insertSportsRowQ;
function insertLeagueRowQ() {
    return `INSERT INTO leagues (name, url, sports_id) VALUES 
                                                        (
                                                        $1,
                                                        $2,
                                                        (SELECT id FROM sports WHERE UPPER(name)=UPPER($3))
                                                        )`;
}
exports.insertLeagueRowQ = insertLeagueRowQ;
function insertMatchRowQ(league, season_id, matchDB) {
    const values_match = Object.keys(matchDB).map((key) => {
        if (key.includes("date")) {
            return `var_${key}:='${matchDB[key]}'::timestamp with time zone`;
        }
        if (typeof matchDB[key] === "string") {
            return `var_${key}:='${matchDB[key]}'::varchar`;
        }
        if (key.includes("score")) {
            if (isNaN(matchDB[key])) {
                return `var_${key}:=NULL::integer`;
            }
            else {
                return `var_${key}:=${matchDB[key]}::integer`;
            }
        }
        if (key.includes("coeff")) {
            if (isNaN(matchDB[key])) {
                return `var_${key}:=NULL::numeric`;
            }
            else {
                return `var_${key}:=${matchDB[key]}::numeric`;
            }
        }
    }).join(", ");
    return `SELECT insert_match(${league.sports_id}, ${league.id}, ${season_id}, $3, $1, $2, ${values_match})`;
}
exports.insertMatchRowQ = insertMatchRowQ;
