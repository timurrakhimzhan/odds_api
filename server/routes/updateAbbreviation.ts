import {Application, Request, Response} from "express";
import {Client} from "pg";
import {Query} from "../../typings";
import {createMessage} from "../../services/createMessage";
import {updateAbbreviationPQ} from "../../database/preparedQueries/update";

export default function updateAbbrevRoute(server: Application, client: Client) {
    server.post("/api/updateAbbrev/:sport/:league/", (req: Request, res: Response) => {

        const {sport, league} = req.params;
        const {id, abbreviation} = req.body;

        if(!sport) {
            res.status(400).send(createMessage("Sport should be provided"));
            return;
        }

        if(!league) {
            res.status(400).send(createMessage("League should be provided"));
            return;
        }

        if(!id) {
            res.status(400).send(createMessage("ID of team should be provided"));
            return;
        }

        if(!abbreviation) {
            res.status(400).send(createMessage("Abbreviation of team should be provided"));
            return;
        }
        client.query(updateAbbreviationPQ(parseInt(id), abbreviation))
            .then(result => res.send(createMessage("Abbreviation successfully updated", {abbreviation, id})))
            .catch(err => res.status(400).send(createMessage(err)));
    })
}