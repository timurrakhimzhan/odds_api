import {Application, Request, Response} from "express";
import {Client} from "pg";
import {createMessage} from "../../services/createMessage";
import {insertLeagueRowQ, insertSportsRowQ} from "../../database/queries";

export default function createLeagueRoute(server: Application, client: Client) {
    server.post("/api/createLeague", async (req: Request, res: Response) => {
        const {leagueName, url, sportName} = req.body;

        if(!leagueName) {
            res.status(400).send(createMessage("No league name provided (leagueName)"));
            return;
        }

        if(!url) {
            res.status(400).send(createMessage("No url provided (url)"));
            return;
        }

        if(!sportName) {
            res.status(400).send(createMessage("No sport name provided (sportName)"));
            return;
        }

        try {
            await client.query(insertLeagueRowQ(leagueName, url, sportName));
        } catch(error) {
            console.log(error);
            res.status(400).send(createMessage(error));
            return;
        }

        res.status(400).send(createMessage(`League ${leagueName} added to sport ${sportName}`));

    });
}