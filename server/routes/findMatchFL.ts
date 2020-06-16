import {Client} from "pg";
import {Application, Request, Response} from "express";
import {createMessage} from "../../services/createMessage";
import {MatchSearchFL, Query} from "../../typings";
import {selectMatchByFLPQ} from "../../database/preparedQueries/select";

export default function createFindFLRoute(server: Application, client: Client) {
    server.get("/api/findMatchFL/:sport/:league/", (req: Request, res: Response) => {

        const {sport, league} = req.params;
        const {team_1, team_2, date, score_1, score_2} = req.query as Query;
        if(!sport) {
            res.status(400).send(createMessage("Sport should be provided"));
            return;
        }

        if(!league) {
            res.status(400).send(createMessage("League should be provided"));
            return;
        }

        if(!team_1 || !team_2) {
            // console.log(team_1, team_2)
            res.status(400).send(createMessage("Both teams should be provided"));
            return;
        }

        if(!date) {
            res.status(400).send(createMessage("Date should be provided"));
            return;
        }

        if(!score_1 || !score_2) {
            res.status(400).send(createMessage("Both scores should be provided"));
            return;
        }

        const datePST = new Date(date).toISOString();
        const match: MatchSearchFL = {team_1, team_2, date: datePST, score_1, score_2, sport, league};
        client.query(selectMatchByFLPQ(match))
            .then(result => res.json({rowCount: result.rowCount, rows: result.rows}))
            .catch(err => res.status(400).send(createMessage(err)));

    })
}