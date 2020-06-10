import {Pool, Client} from 'pg';
import {createSportsTableQ, createLeaguesTableQ, createMatchesTableQ, createTeamsTableQ} from "./queries";


export default async function setup(client: Client, log: Boolean = true): Promise<void> {
    try {
        await client.query(createSportsTableQ);
    } catch(error) {
        throw new Error(`Error while creating 'sports' table: ${error}`);
    }

    if(log)
        console.log("Table 'sports' is created");

    try {
        await client.query(createLeaguesTableQ);
    } catch(error) {
        throw new Error(`Error while creating 'leagues' table: ${error}`);
    }

    if(log)
        console.log("Table 'leagues' is created");

    try {
        await client.query(createTeamsTableQ);
    } catch(error) {
        throw new Error(`Error while creating 'teams' table: ${error}`);
    }

    if(log)
        console.log("Table 'teams' is created");

    try {
        await client.query(createMatchesTableQ);
    } catch(error) {
        throw new Error(`Error while creating 'matches' table: ${error}`)
    }

    if(log) {
        console.log("Table 'matches' is created");
        console.log("Setup is finished");
    }
}
