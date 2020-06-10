"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createMessage_1 = require("../../services/createMessage");
var update_1 = require("../../database/queries/update");
function updateAbbrevRoute(server, client) {
    server.post("/api/updateAbbrev/:sport/:league/", function (req, res) {
        var _a = req.params, sport = _a.sport, league = _a.league;
        var _b = req.body, id = _b.id, abbreviation = _b.abbreviation;
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
        if (!abbreviation) {
            res.status(400).send(createMessage_1.createMessage("Abbreviation of team should be provided"));
            return;
        }
        client.query(update_1.updateAbbreviationQ(parseInt(id), abbreviation))
            .then(function (result) { return res.send(createMessage_1.createMessage("Abbreviation successfully updated", { abbreviation: abbreviation, id: id })); })
            .catch(function (err) { return res.status(400).send(createMessage_1.createMessage(err)); });
    });
}
exports.default = updateAbbrevRoute;
