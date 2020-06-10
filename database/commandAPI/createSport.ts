import {insertSportsRowQ} from "../queries";
import {questionPrompt} from "../../services/readline";
import {connectDB} from "../connect";
import {Client} from "pg";

async function main() {
    const client: Client = await connectDB();
    const sportName: string = await questionPrompt("Sport name:");
    try{
        await client.query(insertSportsRowQ(sportName))
    } catch(error) {
        throw new Error(error);
    }
    console.log(`Sport with name: ${sportName} has been added to database`);
    await client.end();
}

main();