import {Application} from 'express'
import express from 'express';
import * as bodyParser from 'body-parser';
import {connectDB} from "../database/connectDB";
import createFindMatchRoute from "./routes/findMatch";
import updateAbbrevRoute from "./routes/updateAbbreviation";
import updateDateRoute from "./routes/updateDate";


async function main(): Promise<void> {
    const server: Application = express();
    await connectDB();

    server.use(bodyParser.json());
    createFindMatchRoute(server);
    updateAbbrevRoute(server);
    updateDateRoute(server);

    server.listen(3000, () => console.log("Server listens at port 3000"));
}

main();