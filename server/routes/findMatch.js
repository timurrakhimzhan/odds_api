"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createMessage_1 = require("../../services/createMessage");
const select_1 = require("../../database/preparedQueries/select");
function createFindMatchRoute(server, client) {
    server.get("/api/findMatch/:sport/:league/", (req, res) => {
        const { sport, league } = req.params;
        const { team_1, team_2, date, score_1, score_2, team_1_abbreviation, team_2_abbreviation } = req.query;
        if (!sport) {
            res.status(400).send(createMessage_1.createMessage("Sport should be provided"));
            return;
        }
        if (!league) {
            res.status(400).send(createMessage_1.createMessage("League should be provided"));
            return;
        }
        if (!team_1 || !team_2) {
            res.status(400).send(createMessage_1.createMessage("Both teams should be provided"));
            return;
        }
        if (!team_1_abbreviation || !team_2_abbreviation) {
            res.status(400).send(createMessage_1.createMessage("Both abbreviations should be provided"));
            return;
        }
        if (!date) {
            res.status(400).send(createMessage_1.createMessage("Date should be provided"));
            return;
        }
        if (!score_1 || !score_2) {
            res.status(400).send(createMessage_1.createMessage("Both scores should be provided"));
            return;
        }
        const datePST = new Date(date).toISOString();
        const match = { team_1, team_2, date: datePST, score_1, score_2, sport, league, team_1_abbreviation, team_2_abbreviation };
        client.query(select_1.selectMatchByAbbrevPQ(match))
            .then((result) => {
            if (result.rowCount > 0) {
                res.json({ rowCount: result.rowCount, rows: result.rows });
            }
            else {
                return client.query(select_1.selectMatchByFLPQ(match));
            }
        })
            .then(result => {
            if (result) {
                res.json({ rowCount: result.rowCount, rows: result.rows });
            }
        })
            .catch(err => res.status(400).send(createMessage_1.createMessage(err)));
    });
}
exports.default = createFindMatchRoute;
