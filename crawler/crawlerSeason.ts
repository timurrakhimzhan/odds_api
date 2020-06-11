import {Page} from "puppeteer";
import {Client} from "pg";
import {League, MatchCrawled, MatchDB} from "../typings";
import {
    insertMatchRowQ,
    selectMatchQ,
    selectMatchByStatusQ,
    updateMatchQ,
    selectTeamQ,
    insertTeamRowQ
} from "../database/queries";
import {changePage, getPage} from "../services/fetchingService";
import * as cheerio from "cheerio";

export async function crawlSeason(page: Page, client: Client, league: League, seasons_id: number) {
    const {url} = league;
    const response = await client.query(selectMatchByStatusQ("finished"));
    const lastMatch: MatchDB = response.rows[0];

    let finished = false;
    while(true) {
        const currentPage: string = await getPage(page);
        console.log("----------------------------------");
        console.log(`The crawler is on the ${currentPage}th page`);
        console.log("----------------------------------");

        const content: string = await page.content();
        const $: CheerioStatic = cheerio.load(content);
        let date: string;
        if($('#emptyMsg').length) {
            break;
        }
        $('#tournamentTable tr').each((i: number, el: CheerioElement) => {
            if($(el).hasClass('center')) {
                date = $(el).find('.datet').text();
            }
            if($(el).hasClass('deactivate')) {
                let time = $(el).find('.table-time').text();
                let [teamCrawled_1, teamCrawled_2] = $(el).find('.table-participant').text().split(' - ');
                let [scoreCrawled_1, scoreCrawled_2] = $(el).find('.table-score').text().split(':')
                                                            .map(score => parseInt(score));
                let [coeffCrawled_1, coeffCrawled_2] = [$(el).find('.odds-nowrp').first().text(),
                                                        $(el).find('.odds-nowrp').last().text()].map(coeff => parseFloat(coeff));

                teamCrawled_1 = teamCrawled_1.split("").map((letter) => letter == `'` ? `''` : letter).join("");
                teamCrawled_2 = teamCrawled_2.split("").map((letter) => letter == `'` ? `''` : letter).join("");

                let matchUrl = (new URL(url)).origin + $(el).find('.table-participant a').attr('href');
                const datetime = `${date} ${time}+00`;

                if(isNaN(coeffCrawled_1) || isNaN(coeffCrawled_2))
                    return true;

                if(lastMatch && teamCrawled_1 === lastMatch.team_1 && teamCrawled_2 === lastMatch.team_2 && datetime === lastMatch.date) {
                    finished = true;
                    return false;
                }

                let matchCrawled: MatchCrawled = {
                    dateCrawled: datetime,
                    urlCrawled: matchUrl,
                    teamCrawled_1,
                    teamCrawled_2,
                    coeffCrawled_1,
                    coeffCrawled_2,
                    scoreCrawled_1,
                    scoreCrawled_2
                };
                databaseRequests(client, matchCrawled, league, seasons_id).then((res) => {
                    if(res) {
                        // console.log(res);
                    }
                });
            }
        });
        const changed = await changePage(page, false);
        if(finished || !changed) {
            console.log(changed, finished);
            break;
        }
    }
}

async function databaseRequests(client: Client, matchCrawled: MatchCrawled, league: League, seasons_id: number): Promise<string | void> {
    // console.log(`${matchCrawled.teamCrawled_1}-${matchCrawled.teamCrawled_2} is being processed`);

    let {teamCrawled_1, teamCrawled_2, dateCrawled, coeffCrawled_1, coeffCrawled_2, scoreCrawled_1, scoreCrawled_2} = matchCrawled;
    let {id, sports_id} = league;

    let responseMatch = await client.query(selectMatchQ(matchCrawled));

    if(responseMatch.rowCount === 0) {
        const matchDB: MatchDB = {
            date: dateCrawled,
            leagues_id: id,
            sports_id,
            url: matchCrawled.urlCrawled,
            coeff_1: coeffCrawled_1,
            coeff_2: coeffCrawled_2,
            score_1: scoreCrawled_1,
            score_2: scoreCrawled_2,
            seasons_id
        };
        await client.query(insertMatchRowQ(teamCrawled_1, teamCrawled_2, matchDB));
        return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} added`;
    } else {
        let {coeff_1, coeff_2, score_1, score_2} = responseMatch.rows[0];
        if(score_1 == scoreCrawled_1 && score_2 == scoreCrawled_1) {
            return
        }
        if(coeff_1[coeff_1.length - 1] === coeffCrawled_1 && coeff_2[coeff_2.length - 1] === coeffCrawled_2) {
            return;
        }
        await client.query(updateMatchQ(matchCrawled));
        return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} updated`;
    }
}



