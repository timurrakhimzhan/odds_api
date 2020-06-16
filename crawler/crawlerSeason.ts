import {Page} from "puppeteer";
import {Client} from "pg";
import {League, MatchCrawled, MatchDBQuery, State} from "../typings";
import {changePage, getPage} from "../services/fetchingService";
import * as cheerio from "cheerio";
import {selectMatchByStatusPQ, selectMatchPQ} from "../database/preparedQueries/select";
import {insertMatchRowPQ} from "../database/preparedQueries/insert";
import {updateMatchPQ} from "../database/preparedQueries/update";
import {databaseRequests} from "./databaseRequests";

export async function crawlSeason(page: Page, client: Client, league: League, seasons_id: number) {
    const {url} = league;
    const response = await client.query(selectMatchByStatusPQ("finished"));
    const lastMatch: MatchDBQuery = response.rows[0];
    const state: State = {
        finishedAll: false,
        finishedSeason: false,
        functionCreated: false,
    };

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
                let [teamCrawled_1, teamCrawled_2] = $(el).find('.table-participant').text().split(' - ')
                                                            .map(team => team.trim());
                let [scoreCrawled_1, scoreCrawled_2] = $(el).find('.table-score').text().split(':')
                                                            .map(score => parseInt(score));
                let [coeffCrawled_1, coeffCrawled_2] = [$(el).find('.odds-nowrp').first().text(),
                                                        $(el).find('.odds-nowrp').last().text()].map(coeff => parseFloat(coeff));

                let matchUrl = (new URL(url)).origin + $(el).find('.table-participant a').attr('href');
                const datetime = `${date} ${time}+00`;

                if(isNaN(coeffCrawled_1) || isNaN(coeffCrawled_2))
                    return true;
                if(lastMatch && teamCrawled_1 === lastMatch.team_1 && teamCrawled_2 === lastMatch.team_2 &&
                    new Date(datetime).toISOString() === new Date(lastMatch.date).toISOString()) {
                    state.finishedAll = true;
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
                databaseRequests(client, matchCrawled, league, seasons_id, state).then((res) => {
                    if(res) {
                    }
                });
            }
        });
        const changed = await changePage(page, false);
        if(state.finishedAll) {
            return;
        }
        if(state.finishedSeason || !changed) {
            console.log(changed, finished);
            break;
        }
    }
}




