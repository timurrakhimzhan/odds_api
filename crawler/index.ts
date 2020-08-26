import puppeteer from "puppeteer";
import {Sequelize} from "sequelize";
import {connectDB} from "../database/connectDB";
import {crawler} from "./crawler";
import {Leagues} from "../database/models/leagues";
import store from "../state/store";


export async function crawlLeague(name: string) {
    const {crawler: crawlerState} = store.getState();
    let sequelize: Sequelize | null = crawlerState.daemon ? null : await connectDB();
    const browser = await puppeteer.launch({headless: true});
    console.log("Browser has been launched");
    const league: Leagues | null = await Leagues.findOne({where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', name))});
    if(league) {
        await crawler(browser, league);
    }
    await browser.close();
    if(sequelize) {
        await sequelize.close();
    }
}

if(require?.main === module) {
    crawlLeague("nba").then();
}


