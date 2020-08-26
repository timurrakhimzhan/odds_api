import {Client} from "pg";
import {Application, Request, Response} from "express";
import {createMessage} from "../../services/createMessage";
import {Query} from "../../typings";
import Sequelize, {Op} from "sequelize";
import {Matches} from "../../database/models/matches";
import moment from "moment";

export default function createFindMatchRoute(server: Application) {
    server.get("/api/findMatch/:sport/:league/", async (req: Request, res: Response) => {

        const {sport, league} = req.params;
        const {team_1, team_2, start_date, team_1_abbreviation, team_2_abbreviation, team_1_score, team_2_score} = req.query as Query;
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

        if(!start_date) {
            res.status(400).send(createMessage("Date should be provided"));
            return;
        }
        let abbrevConditions = [
            Sequelize.where(Sequelize.col("TeamsHome.abbreviation"), team_1_abbreviation),
            Sequelize.where(Sequelize.col("TeamsAway.abbreviation"), team_2_abbreviation)];
        let abbrevConditionsReversed = [
            Sequelize.where(Sequelize.col("TeamsHome.abbreviation"), team_2_abbreviation),
            Sequelize.where(Sequelize.col("TeamsAway.abbreviation"), team_1_abbreviation)];

        let flConditions = [
            Sequelize.where(Sequelize.col("TeamsHome.name"), {[Op.like]: `${team_1.slice(0, 2)}%`}),
            Sequelize.where(Sequelize.col("TeamsAway.name"), {[Op.like]: `${team_2.slice(0, 2)}%`})];
        let flConditionReversed = [
            Sequelize.where(Sequelize.col("TeamsHome.name"), {[Op.like]: `${team_2.slice(0, 2)}%`}),
            Sequelize.where(Sequelize.col("TeamsAway.name"), {[Op.like]: `${team_1.slice(0, 2)}%`})];

        if(team_1_score && team_2_score) {
            abbrevConditions = [...abbrevConditions,
                Sequelize.where(Sequelize.col("home_score"), team_1_score),
                Sequelize.where(Sequelize.col("away_score"), team_2_score)
            ];
            abbrevConditionsReversed = [...abbrevConditionsReversed,
                Sequelize.where(Sequelize.col("home_score"), team_2_score),
                Sequelize.where(Sequelize.col("away_score"), team_1_score)
            ];
            flConditions = [...flConditions,
                Sequelize.where(Sequelize.col("home_score"), team_1_score),
                Sequelize.where(Sequelize.col("away_score"), team_2_score)
            ];
            flConditionReversed = [...flConditionReversed,
                Sequelize.where(Sequelize.col("home_score"), team_2_score),
                Sequelize.where(Sequelize.col("away_score"), team_1_score)
            ];
        }

        const matchesByAbbrev = await Matches.findAll({
            where: {
                start_date: {
                    [Op.between]: [moment(start_date).subtract(1, "days").toDate(), moment(start_date).add(1, "days").toDate()]
                },
                [Op.or]: [{[Op.and]: abbrevConditions}, {[Op.and]: abbrevConditionsReversed}]
            },
            include: [
                Matches.TeamsHome, Matches.TeamsAway
            ]
        });
        if(matchesByAbbrev.length > 0) {
            res.json({rowCount: matchesByAbbrev.length, rows: matchesByAbbrev});
            return;
        }

        const matchesByFirstLetter = await Matches.findAll({
            where: {
                start_date: {
                    [Op.between]: [moment(start_date).subtract(1, "days").toDate(), moment(start_date).add(1, "days").toDate()]
                },
                [Op.or]: [{[Op.and]: flConditions}, {[Op.and]: flConditionReversed}]
            },
            include: [
                Matches.TeamsHome, Matches.TeamsAway
            ]
        });
        res.json({rowCount: matchesByFirstLetter.length, rows: matchesByFirstLetter});
    })
}