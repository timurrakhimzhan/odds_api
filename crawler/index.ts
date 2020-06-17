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
    for(let row of rows) {
        await crawler(browser, client, row);
        console.log(`${row.name} league is added`);
    }
    await browser.close();
    console.log("Finished");
}

crawlLeague("nba").then();


