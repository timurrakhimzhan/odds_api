import {Browser, ElementHandle, Page} from "puppeteer";
import {Client} from "pg";
import {League} from "../typings";
import {changeTimezone, pageLoaded} from "../services/fetchingService";
import {crawlSeason} from "./crawlerSeason";

export async function crawler(browser: Browser, client: Client, league: League): Promise<void> {
    const page: Page = await browser.newPage();
    const {url} = league;
    await page.goto(url);

    await changeTimezone(page);
    console.log("----------------------------------");
    console.log("Timezone changed");
    console.log("----------------------------------");

    let seasons: Array<ElementHandle<Element>> = await page.$$('.main-menu-gray .main-filter a');
    let seasonsNumber: number = seasons.length;
    for(let i = 0; i < seasonsNumber; i++) {
        seasons = await page.$$('.main-menu-gray .main-filter a');
        await seasons[i].click();
        await page.waitForNavigation();
        await pageLoaded(page);

        const season: string = await page.evaluate(() => {
            const container: HTMLElement = document.querySelector(".main-menu-gray .main-filter .active") as HTMLElement;
            return container.innerText;
        });
        console.log(`We are currently on season ${season}`);
        await crawlSeason(page, client, league, season);
    }

    await page.close();
    await client.end();
}