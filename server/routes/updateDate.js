"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createMessage_1 = require("../../services/createMessage");
const matches_1 = require("../../database/models/matches");
function updateDateRoute(server) {
    server.post("/api/updateDate/:sport/:league/", (req, res) => {
        const { sport, league } = req.params;
        const { id, start_date } = req.body;
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
        if (!start_date) {
            res.status(400).send(createMessage_1.createMessage("Abbreviation of team should be provided"));
            return;
        }
        matches_1.Matches.update({ start_date }, { where: { id } })
            .then(result => res.send(createMessage_1.createMessage("Date is successfully updated", { id, start_date })))
            .catch(err => res.status(400).send(createMessage_1.createMessage(err)));
    });
}
exports.default = updateDateRoute;
