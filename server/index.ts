import {Application, Express, Request, Response, } from 'express'
import express from 'express';
import * as bodyParser from 'body-parser';
import {connectDB} from "../database/connect";
import {Client} from "pg";
import setup from "../database/commandAPI/setup";
import {createMessage} from "../services/createMessage";
import createFindFLRoute from "./routes/findMatchFL";
import updateAbbrevRoute from "./routes/updateAbbreviation";
import updateDateRoute from "./routes/updateDate";


async function main(): Promise<void> {
    const server: Application = express();
    const client: Client = await connectDB();
    console.log("Connected to database");

    server.use(bodyParser.json());
    createFindFLRoute(server, client);
    updateAbbrevRoute(server, client);
    updateDateRoute(server, client);

    server.listen(3000, () => console.log("Server listens at port 3000"));
}

main();