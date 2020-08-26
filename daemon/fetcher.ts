import store from "../state/store";
import {setDaemon} from "../state/actions/crawler";
import {Sequelize} from "sequelize";
import {connectDB} from "../database/connectDB";
import {Leagues} from "../database/models/leagues";
import {crawlLeague} from "../crawler";

export async function fetcher() {
    store.dispatch(setDaemon(true));
    const sequelize: Sequelize = await connectDB();
    const rows = await Leagues.findAll();
    for (let row of rows) {
        const name: string = row.get("name") as string;
        console.log(`Started League: ${name}`);
        await crawlLeague(name);
        console.log(`Finished League: ${name}`);
    }
    await sequelize.close();
}

if(require.main === module) {
    fetcher();
}