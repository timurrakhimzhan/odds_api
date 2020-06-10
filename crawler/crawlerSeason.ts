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

export async function crawlSeason(page: Page, client: Client, league: League, season: string) {
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
                databaseRequests(client, matchCrawled, league, season).then((res) => {
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

async function databaseRequests(client: Client, matchCrawled: MatchCrawled, league: League, season: string): Promise<string | void> {
    console.log(`${matchCrawled.teamCrawled_1}-${matchCrawled.teamCrawled_2} is being processed`);

    let {teamCrawled_1, teamCrawled_2, dateCrawled, coeffCrawled_1, coeffCrawled_2, scoreCrawled_1, scoreCrawled_2} = matchCrawled;
    let {id, sports_id} = league;

    let responseTeam_1 = await client.query(selectTeamQ(teamCrawled_1));
    if(responseTeam_1.rowCount === 0) {
        await client.query(insertTeamRowQ(teamCrawled_1, sports_id, id));
    }

    let responseTeam_2 = await client.query(selectTeamQ(teamCrawled_2));
    if(responseTeam_2.rowCount === 0) {
        await client.query(insertTeamRowQ(teamCrawled_2, sports_id, id));
    }

    let responseMatch = await client.query(selectMatchQ(matchCrawled));
    if(responseMatch.rowCount === 0) {
        [responseTeam_1, responseTeam_2] = await Promise.all([client.query(selectTeamQ(teamCrawled_1)),
                                                                    client.query(selectTeamQ(teamCrawled_2))]);
        const [teams_id_1, teams_id_2] = [responseTeam_1.rows[0].id, responseTeam_2.rows[0].id];

        const matchDB: MatchDB = {
            date: dateCrawled,
            team_1: teamCrawled_1,
            teams_id_1,
            team_2: teamCrawled_2,
            teams_id_2,
            leagues_id: id,
            sports_id,
            url: matchCrawled.urlCrawled,
            coeff_1: coeffCrawled_1,
            coeff_2: coeffCrawled_2,
            score_1: scoreCrawled_1,
            score_2: scoreCrawled_2,
            season
        };
        await client.query(insertMatchRowQ(matchDB));
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



