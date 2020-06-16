import {Application, Request, Response} from "express";
import {Client} from "pg";
import {Query} from "../../typings";
import {createMessage} from "../../services/createMessage";
import {updateMatchDatePQ} from "../../database/preparedQueries/update";

export default function updateDateRoute(server: Application, client: Client) {
    server.post("/api/updateDate/:sport/:league/", (req: Request, res: Response) => {

        const {sport, league} = req.params;
        const {id, date} = req.body;

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

        if(!date) {
            res.status(400).send(createMessage("Abbreviation of team should be provided"));
            return;
        }
        client.query(updateMatchDatePQ(parseInt(id), date))
            .then(result => res.send(createMessage("Date is successfully updated", {id, date})))
            .catch(err => res.status(400).send(createMessage(err)));
    })
}