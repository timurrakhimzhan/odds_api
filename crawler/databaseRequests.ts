import {Client} from "pg";
import {League, MatchCrawled, MatchDBQuery, State} from "../typings";
import {selectMatchPQ} from "../database/preparedQueries/select";
import {insertMatchRowPQ} from "../database/preparedQueries/insert";
import {updateMatchPQ} from "../database/preparedQueries/update";
import {createFunctionInsertMatch} from "../database/queries/create";

export async function databaseRequests(client: Client, matchCrawled: MatchCrawled, league: League, seasons_id: number, state: State): Promise<string | void> {

    let {teamCrawled_1, teamCrawled_2, dateCrawled, coeffCrawled_1, coeffCrawled_2, scoreCrawled_1, scoreCrawled_2} = matchCrawled;

    let responseMatch = await client.query(selectMatchPQ(matchCrawled));

    if(responseMatch.rowCount === 0) {
        const matchDB: MatchDBQuery = {
            date: dateCrawled,
            url: matchCrawled.urlCrawled,
            coeff_1: coeffCrawled_1,
            coeff_2: coeffCrawled_2,
            score_1: scoreCrawled_1,
            score_2: scoreCrawled_2,
        };
        if(!state.functionCreated) {
            await client.query(createFunctionInsertMatch(matchDB));
            state.functionCreated = true;
        }
        await client.query(insertMatchRowPQ(teamCrawled_1, teamCrawled_2, league, seasons_id, matchDB));
        return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} added`;
    } else {
        let {coeff_1, coeff_2, score_1, score_2} = responseMatch.rows[0];
        if(parseInt(score_1) == scoreCrawled_1 && parseInt(score_2) == scoreCrawled_1) {
            return
        }
        if(parseFloat(coeff_1[coeff_1.length - 1]) === coeffCrawled_1 && parseFloat(coeff_2[coeff_2.length - 1]) === coeffCrawled_2) {
            return;
        }
        await client.query(updateMatchPQ(matchCrawled));
        return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} updated`;
    }
}