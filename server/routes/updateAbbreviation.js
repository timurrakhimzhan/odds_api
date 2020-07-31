"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createMessage_1 = require("../../services/createMessage");
const update_1 = require("../../database/preparedQueries/update");
function updateAbbrevRoute(server, client) {
    server.post("/api/updateAbbrev/:sport/:league/", (req, res) => {
        const { sport, league } = req.params;
        const { id, abbreviation } = req.body;
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
        client.query(update_1.updateAbbreviationPQ(parseInt(id), abbreviation))
            .then(result => res.send(createMessage_1.createMessage("Abbreviation successfully updated", { abbreviation, id })))
            .catch(err => res.status(400).send(createMessage_1.createMessage(err)));
    });
}
exports.default = updateAbbrevRoute;
