import puppeteer from "puppeteer";
import {Client} from "pg";
import {connectDB} from "../database/connect";
import {crawler} from "./crawler";
import {selectLeaguesPQ} from "../database/preparedQueries/select";


export async function crawlLeague(name?: string, client?: Client) {
    if(!client) {
        client = await connectDB();
    }
    const browser = await puppeteer.launch({headless: true});
    const {rows} = await client.query(selectLeaguesPQ(name));
    await crawler(browser, client, rows[0]);
    await browser.close();
}

if(require?.main === module) {
    crawlLeague("nba").then();
}


