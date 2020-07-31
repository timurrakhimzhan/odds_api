import {Application, Express, Request, Response, } from 'express'
import express from 'express';
import * as bodyParser from 'body-parser';
import {connectDB} from "../database/connectDB";
import {Client} from "pg";
import {createMessage} from "../services/createMessage";
import createFindMatchRoute from "./routes/findMatch";
import updateAbbrevRoute from "./routes/updateAbbreviation";
import updateDateRoute from "./routes/updateDate";


async function main(): Promise<void> {
    const server: Application = express();
    const client: Client = {} as Client;
    console.log("Connected to database");

    server.use(bodyParser.json());
    createFindMatchRoute(server, client);
    updateAbbrevRoute(server, client);
    updateDateRoute(server, client);

    server.listen(3000, () => console.log("Server listens at port 3000"));
}

main();