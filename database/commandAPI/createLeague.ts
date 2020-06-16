import {Client} from "pg";
import {connectDB} from "../connect";
import {questionPrompt} from "../../services/readline";
import {insertLeagueRowPQ} from "../preparedQueries/insert";

async function main() {
    const client: Client = await connectDB();
    const sportName: string = await questionPrompt("Sport name:");
    const leagueName: string = await questionPrompt("League name:");
    const url: string = await questionPrompt("URL of archived odds:");
    try{
        await client.query(insertLeagueRowPQ(sportName, leagueName, url));
    } catch(error) {
        throw new Error(error);
    }
    console.log(`Sport with name: ${sportName} and ${leagueName} has been added to database`);
    await client.end();
}

main();