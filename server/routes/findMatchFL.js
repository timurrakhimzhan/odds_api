"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createMessage_1 = require("../../services/createMessage");
var select_1 = require("../../database/preparedQueries/select");
function createFindFLRoute(server, client) {
    server.get("/api/findMatchFL/:sport/:league/", function (req, res) {
        var _a = req.params, sport = _a.sport, league = _a.league;
        var _b = req.query, team_1 = _b.team_1, team_2 = _b.team_2, date = _b.date, score_1 = _b.score_1, score_2 = _b.score_2;
        if (!sport) {
            res.status(400).send(createMessage_1.createMessage("Sport should be provided"));
            return;
        }
        if (!league) {
            res.status(400).send(createMessage_1.createMessage("League should be provided"));
            return;
        }
        if (!team_1 || !team_2) {
            // console.log(team_1, team_2)
            res.status(400).send(createMessage_1.createMessage("Both teams should be provided"));
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
        var datePST = new Date(date).toISOString();
        var match = { team_1: team_1, team_2: team_2, date: datePST, score_1: score_1, score_2: score_2, sport: sport, league: league };
        client.query(select_1.selectMatchByFLPQ(match))
            .then(function (result) { return res.json({ rowCount: result.rowCount, rows: result.rows }); })
            .catch(function (err) { return res.status(400).send(createMessage_1.createMessage(err)); });
    });
}
exports.default = createFindFLRoute;
