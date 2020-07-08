import {Browser, ElementHandle, Page} from "puppeteer";
import {Client} from "pg";
import {League} from "../typings";
import {changeTimezone, pageLoaded} from "../services/fetchingService";
import {crawlSeason} from "./crawlerSeason";
import {selectOrInsertSeason} from "../database/queries/select";
import {createFunctionSelectOrInsertSeason} from "../database/queries/create";
import {CrawlerState, State} from "../typings/states";
import store from "../state/store";

export async function crawler(browser: Browser, client: Client, league: League): Promise<void> {
    const page: Page = await browser.newPage();
    const {url} = league;
    await page.goto(url);

    await changeTimezone(page);
    console.log("----------------------------------");
    console.log("Timezone changed");
    console.log("----------------------------------");

    await client.query(createFunctionSelectOrInsertSeason);

    let seasons: Array<ElementHandle<Element>> = await page.$$('.main-menu-gray .main-filter a');
    let seasonsNumber: number = seasons.length;
    for(let i = 0; i < seasonsNumber; i++) {
        seasons = await page.$$('.main-menu-gray .main-filter a');
        await seasons[i].click();
        await page.waitForNavigation();
        await pageLoaded(page);

        const season: string = await page.evaluate(() => {
            const container: HTMLElement = document.querySelector(".main-menu-gray .main-filter .active") as HTMLElement;
            return container.innerText.split("/").join("-");
        });
        console.log(`We are currently on season ${season}`);
        const seasonInserted = await client.query(selectOrInsertSeason(season, league.sports_id, league.id));
        const seasons_id: number = parseInt(seasonInserted.rows[0].id);
        await crawlSeason(page, client, league, seasons_id);
        const {crawler}: State = store.getState();
        if(crawler.finishedCrawling) {
            break;
        }
    }

    await page.close();
}