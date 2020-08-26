import {Browser, ElementHandle, Page} from "puppeteer";
import {Client} from "pg";
import {League} from "../typings";
import {changeTimezone, pageLoaded} from "../services/fetchingService";
import {crawlSeason} from "./crawlerSeason";
import {State} from "../typings/states";
import store from "../state/store";
import {Leagues} from "../database/models/leagues";
import {Seasons} from "../database/models/seasons";

export async function crawler(browser: Browser, league: Leagues): Promise<void> {
    const page: Page = await browser.newPage();
    const url: string = league.get("url") as string;
    const {crawler} = store.getState();
    const crawlerUrl = crawler.daemon ? url : url + "results/";
    console.log("Page opening with url:", crawlerUrl);
    await page.goto(crawlerUrl);
    console.log("Page opened with url:", crawlerUrl);

    await changeTimezone(page);
    console.log("----------------------------------");
    console.log("Timezone changed");
    console.log("----------------------------------");

    if(crawler.daemon) {
        const season: Seasons | null = await Seasons.findOne({
            where: {
                sports_id: league.get("sports_id") as number,
                leagues_id: league.get("id") as number,
                current: true
            }
        });
        if(season) {
            await crawlSeason(page, league, season);
        } else {
            console.log("No current season for this league");
        }
        await page.close();
        return;
    }

    let seasons: Array<ElementHandle<Element>> = await page.$$('.main-menu-gray .main-filter a');
    let seasonsNumber: number = seasons.length;
    for(let i = 0; i < seasonsNumber; i++) {
        seasons = await page.$$('.main-menu-gray .main-filter a');
        await seasons[i].click();
        await page.waitForNavigation();
        await pageLoaded(page);

        const seasonName: string = await page.evaluate(() => {
            const container: HTMLElement = document.querySelector(".main-menu-gray .main-filter .active") as HTMLElement;
            return container.innerText.split("/").join("-");
        });
        console.log(`We are currently on season ${seasonName}`);
        const [season]: [Seasons, boolean] = await Seasons.findOrCreate({
            where: {
                name: seasonName,
                sports_id: league.get("sports_id") as number,
                leagues_id: league.get("id") as number
            }
        });
        await crawlSeason(page, league, season);
        const {crawler}: State = store.getState();
        if(crawler.finishedCrawling) {
            break;
        }
    }

    await page.close();
}