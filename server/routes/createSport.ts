import {Application, Express, Request, Response} from "express";
import {Client} from "pg";
import {createMessage} from "../../services/createMessage";
import {insertSportsRowQ} from "../../database/queries";

export default function createSportRoute(server: Application, client: Client) {
    server.post("/api/createSport", async (req: Request, res: Response) => {
        const {sportName} = req.body;
        if(!sportName) {
            res.status(400).send(createMessage("No sport name provided (sportName)"));
            return
        }
        try {
            await client.query(insertSportsRowQ(sportName));
        } catch(error) {
            console.log(error);
            res.status(400).send(createMessage(error));
            return;
        }

        res.status(400).send(createMessage(`Sport ${sportName} added`));
    });
}