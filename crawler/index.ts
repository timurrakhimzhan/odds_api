import puppeteer from "puppeteer";
import {Sequelize} from "sequelize";
import {connectDB} from "../database/connectDB";
import {crawler} from "./crawler";
import {Leagues} from "../database/models/leagues";


export async function crawlLeague(name?: string) {
    let sequelize: Sequelize = await connectDB();
    const browser = await puppeteer.launch({headless: true});
    const league: Leagues | null = await Leagues.findOne({where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', name))});
    if(league) {
        await crawler(browser, league);
    }
    await browser.close();
    await sequelize.close();
}

if(require?.main === module) {
    crawlLeague("nba").then();
}


