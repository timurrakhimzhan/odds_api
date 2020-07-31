import {Client} from "pg";
import {connectDB} from "../../database/connectDB";
import {selectAllleaguesPQ} from "../../database/preparedQueries/select";
import {crawler} from "../../crawler/crawler";
import {crawlLeague} from "../../crawler";
import store from "../../state/store";
import {setDaemon} from "../../state/actions/crawler";

async function process() {
    const client: Client = {} as Client;
    const {rows} = (await client.query(selectAllleaguesPQ()));
    for(let row of rows) {
        console.log(`Started League: ${row.name}`);
        // await crawlLeague(row.name, client);
        console.log(`Finished League: ${row.name}`);
    }
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