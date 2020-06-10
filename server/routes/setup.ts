import {Request, Response, Express, Application} from "express";
import setup from "../../database/setup";
import {createMessage} from "../../services/createMessage";
import {Client} from "pg";
import * as puppeteer from 'puppeteer';


export default function setupRoute(server: Application, client: Client) {
    server.get("/api/setup", async (req: Request, res: Response) => {
        try {
            await setup(client);
        } catch(error) {
            console.log(error);
            res.status(400).send(createMessage(error));
            return;
        }
        res.send(createMessage("Database has been set up"));
    });
}
