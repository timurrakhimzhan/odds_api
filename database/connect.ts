import {Pool, Client} from 'pg';
import * as dotenv from 'dotenv';
import {createFunctionSelectOrInsertSeason} from "./queries/create";
dotenv.config({path: `${__dirname}/../.env`});


export async function connectDB(): Promise<Client> {
    const client: Client = new Client({
        user: process.env.user,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: parseInt(process.env.port as string),
    });

    try {
        await client.connect();
    } catch(error) {
        throw new Error(`Could not connected to database, ${error}`);
    }
    return client;
}
