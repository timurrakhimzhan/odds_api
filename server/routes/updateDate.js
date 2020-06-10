"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createMessage_1 = require("../../services/createMessage");
var update_1 = require("../../database/queries/update");
function updateDateRoute(server, client) {
    server.post("/api/updateDate/:sport/:league/", function (req, res) {
        var _a = req.params, sport = _a.sport, league = _a.league;
        var _b = req.body, id = _b.id, date = _b.date;
        if (!sport) {
            res.status(400).send(createMessage_1.createMessage("Sport should be provided"));
            return;
        }
        if (!league) {
            res.status(400).send(createMessage_1.createMessage("League should be provided"));
            return;
        }
        if (!id) {
            res.status(400).send(createMessage_1.createMessage("ID of team should be provided"));
            return;
        }
        if (!date) {
            res.status(400).send(createMessage_1.createMessage("Abbreviation of team should be provided"));
            return;
        }
        client.query(update_1.updateMatchDateQ(parseInt(id), date))
            .then(function (result) { return res.send(createMessage_1.createMessage("Date is successfully updated", { id: id, date: date })); })
            .catch(function (err) { return res.status(400).send(createMessage_1.createMessage(err)); });
    });
}
exports.default = updateDateRoute;
