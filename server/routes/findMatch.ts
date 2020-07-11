import {Client} from "pg";
import {Application, Request, Response} from "express";
import {createMessage} from "../../services/createMessage";
import {Query} from "../../typings";
import {selectMatchByAbbrevPQ, selectMatchByFLPQ} from "../../database/preparedQueries/select";
import {MatchSearch} from "../../typings/server";

export default function createFindMatchRoute(server: Application, client: Client) {
    server.get("/api/findMatch/:sport/:league/", (req: Request, res: Response) => {

        const {sport, league} = req.params;
        const {team_1, team_2, date, score_1, score_2, team_1_abbreviation, team_2_abbreviation} = req.query as Query;
        if(!sport) {
            res.status(400).send(createMessage("Sport should be provided"));
            return;
        }

        if(!league) {
            res.status(400).send(createMessage("League should be provided"));
            return;
        }

        if(!team_1 || !team_2) {
            res.status(400).send(createMessage("Both teams should be provided"));
            return;
        }

        if(!team_1_abbreviation || !team_2_abbreviation) {
            res.status(400).send(createMessage("Both abbreviations should be provided"));
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
        const match: MatchSearch = {team_1, team_2, date: datePST, score_1, score_2, sport, league, team_1_abbreviation, team_2_abbreviation};
        client.query(selectMatchByAbbrevPQ(match))
            .then((result) => {
                if(result.rowCount > 0) {
                    res.json({rowCount: result.rowCount, rows: result.rows})
                } else {
                    return client.query(selectMatchByFLPQ(match));
                }
            })
            .then(result => {
                if(result) {
                    res.json({rowCount: result.rowCount, rows: result.rows})
                }
            })
            .catch(err => res.status(400).send(createMessage(err)));

    })
}