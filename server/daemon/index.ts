import {connectDB} from "../../database/connectDB";
import store from "../../state/store";
import {setDaemon} from "../../state/actions/crawler";
import {Sequelize} from "sequelize";
import {Leagues} from "../../database/models/leagues";
import {crawlLeague} from "../../crawler";

async function process() {
    const sequelize: Sequelize = await connectDB();
    const rows = await Leagues.findAll();
    for(let row of rows) {
        const name: string = row.get("name") as string;
        console.log(`Started League: ${name}`);
        await crawlLeague(name);
        console.log(`Finished League: ${name}`);
    }
    await sequelize.close();
}

async function daemon() {
    store.dispatch(setDaemon(true))
    await process();
    console.log("Crawled. Waiting for an hour...")
    setTimeout(daemon, 1000 * 60 * 60);
}

if(require?.main === module) {
    daemon()
}