import {Application, Request, Response} from "express";
import {createMessage} from "../../services/createMessage";
import {Matches} from "../../database/models/matches";

export default function updateDateRoute(server: Application) {
    server.post("/api/updateDate/:sport/:league/", (req: Request, res: Response) => {

        const {sport, league} = req.params;
        const {id, start_date} = req.body;

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

        if(!start_date) {
            res.status(400).send(createMessage("Abbreviation of team should be provided"));
            return;
        }
        Matches.update({start_date}, {where: {id}})
            .then(result => res.send(createMessage("Date is successfully updated", {id, start_date})))
            .catch(err => res.status(400).send(createMessage(err)));
    })
}