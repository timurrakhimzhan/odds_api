import {Page} from "puppeteer";
import {Client} from "pg";
import {League} from "../typings";
import {changePage, getPage} from "../services/fetchingService";
import * as cheerio from "cheerio";
import {selectMatchByStatusPQ, selectMatchPQ} from "../database/preparedQueries/select";
import {insertMatchRowPQ} from "../database/preparedQueries/insert";
import {updateMatchPQ} from "../database/preparedQueries/update";
import {databaseRequests} from "./databaseRequests";
import {createFunctionSelectOrInsertSeason} from "../database/queries/create";
import {CrawlerState, State} from "../typings/states";
import {MatchCrawled, MatchDBQuery} from "../typings/crawler";
import store from "../state/store";
import moment from "moment";
import {setFinishedCrawling} from "../state/actions/crawler";
import {StateFromReducersMapObject} from "redux";

export async function crawlSeason(page: Page, client: Client, league: League, seasons_id: number) {
    const {url} = league;
    const response = await client.query(selectMatchByStatusPQ(league.name, "finished"));
    const lastMatch: MatchDBQuery = response.rows[0];

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
            let {crawler}: State = store.getState();
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
                const datetime = `${date} ${time}Z`;

                if(isNaN(coeffCrawled_1) || isNaN(coeffCrawled_2))
                    return true;
                if(lastMatch && crawler.daemon
                && teamCrawled_1 === lastMatch.team_1 && teamCrawled_2 === lastMatch.team_2
                && scoreCrawled_1 === lastMatch.score_1 && scoreCrawled_2 === lastMatch.score_2
                && Math.abs(moment.duration(moment(datetime, "DD MMMM YYYY HH:mm ZZ").diff(lastMatch.date)).asDays()) < 1) {
                    store.dispatch(setFinishedCrawling(true));
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
                    }
                });
            }
        });
        const changed = await changePage(page, false);
        let {crawler}: State = store.getState();
        if(crawler.finishedCrawling) {
            return;
        }
        if(!changed) {
            break;
        }
    }
}




