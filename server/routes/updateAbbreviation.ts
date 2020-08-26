import {Application, Request, Response} from "express";
import {createMessage} from "../../services/createMessage";
import {Teams} from "../../database/models/teams";

export default function updateAbbrevRoute(server: Application) {
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
            res.status(400).send(createMessage("Abbreviation of a team should be provided"));
            return;
        }

        Teams.update({abbreviation},{where: {id}})
            .then(() => res.send(createMessage("Abbreviation successfully updated", {abbreviation, id})))
            .catch(err => res.status(400).send(createMessage(err)));
    })
}