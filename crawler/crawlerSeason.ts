import {Page} from "puppeteer";
import {changePage, getPage} from "../services/fetchingService";
import * as cheerio from "cheerio";
import {databaseRequests} from "./databaseRequests";
import {State} from "../typings/states";
import {MatchCrawled, MatchDBQuery} from "../typings/crawler";
import store from "../state/store";
import moment from "moment";
import {setFinishedCrawling} from "../state/actions/crawler";
import {Leagues} from "../database/models/leagues";
import {Seasons} from "../database/models/seasons";
import {Matches} from "../database/models/matches";
import Sequelize from "sequelize";
import {Teams} from "../database/models/teams";

export async function  crawlSeason(page: Page, league: Leagues, season: Seasons) {
    const url: string = league.get("url") as string;
    const lastMatch: Matches | null = await Matches.findOne({include: [
            {
                association: Matches.Leagues,
                where: {
                    name: league.get("name") as string
                }
            },
            {
                association: Matches.Status,
                where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('Status.name')), Sequelize.fn('lower', "finished")),
            },
            {association: Matches.TeamsHome}, {association: Matches.TeamsAway}
        ], order: [["start_date", "DESC"]]});


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
                if(date.includes(",")) {
                    date = date.split(",")[1].trim() + " " + (new Date()).getFullYear();
                }
                return true;
            }
            if($(el).attr("xeid")) {
                if($(el).find('.table-participant .live-odds-ico-prev').length > 0) {  //if in play
                    return true;
                }

                let time = $(el).find('.table-time').text();
                let [teamCrawled_1, teamCrawled_2] = $(el).find('.table-participant').text().split(' - ')
                                                            .map(team => team.trim());
                let [scoreCrawled_1, scoreCrawled_2] = $(el).find('.table-score').text().split(':')
                                                            .map(score => parseInt(score));
                let [coeffCrawled_1, coeffCrawled_2] = [$(el).find('.odds-nowrp').first().text(),
                                                        $(el).find('.odds-nowrp').last().text()].map(coeff => parseFloat(coeff));
                const statusCrawled = $(el).find('.result-ok').length > 0 ? "finished": "progress";

                let matchUrl = (new URL(url)).origin + $(el).find('.table-participant a').attr('href');
                const datetime = moment(`${date} ${time}Z`, "DD MMMM YYYY HH:mm ZZ");
                if(isNaN(coeffCrawled_1) || isNaN(coeffCrawled_2))
                    return true;


                if(lastMatch
                && teamCrawled_1 === (lastMatch.get("TeamsHome") as Teams).get("name")
                && teamCrawled_2 === (lastMatch.get("TeamsAway") as Teams).get("name")
                && scoreCrawled_1 === lastMatch.get("home_score")
                && scoreCrawled_2 === lastMatch.get("away_score")
                && Math.abs(moment.duration(moment(datetime, "DD MMMM YYYY HH:mm ZZ").diff(lastMatch.get("start_date") as string)).asDays()) < 1) {
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
                    scoreCrawled_2,
                    statusCrawled
                };
                databaseRequests(matchCrawled, league, season).then((res) => {
                    if(res) {
                        console.log(res);
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




