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
        const {team_1, team_2, date, team_1_abbreviation, team_2_abbreviation} = req.query as Query;
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

        const matchesByAbbrev = await Matches.findAll({
            where: {
                [Op.and]: [
                    {
                        start_date: {
                            [Op.between]: [moment(date).subtract(1, "days").toDate(), moment(date).add(1, "days").toDate()]
                        }
                    },
                    {[Op.or]: [
                            {[Op.and]: [
                                    Sequelize.where(Sequelize.col("TeamsHome.abbreviation"), team_1_abbreviation),
                                    Sequelize.where(Sequelize.col("TeamsAway.abbreviation"), team_2_abbreviation)]
                            },
                            {[Op.and]: [
                                    Sequelize.where(Sequelize.col("TeamsHome.abbreviation"), team_2_abbreviation),
                                    Sequelize.where(Sequelize.col("TeamsAway.abbreviation"), team_1_abbreviation)]
                            },
                        ]}
                ]

            },
            include: [
                Matches.TeamsHome, Matches.TeamsAway
            ],
            raw: true
        });
        if(matchesByAbbrev.length > 0) {
            res.json({rowCount: matchesByAbbrev.length, rows: matchesByAbbrev});
            return;
        }
        const matchesByFirstLetter = await Matches.findAll({
            where: {
                [Op.and]: [
                    {
                        start_date: {
                            [Op.between]: [moment(date).subtract(1, "days").toDate(), moment(date).add(1, "days").toDate()]
                        }
                    },
                    {[Op.or]: [
                            {[Op.and]: [
                                    Sequelize.where(Sequelize.col("TeamsHome.name"), {[Op.like]: `${team_1[0]}%`}),
                                    Sequelize.where(Sequelize.col("TeamsAway.name"), {[Op.like]: `${team_2[0]}%`})]
                            },
                            {[Op.and]: [
                                    Sequelize.where(Sequelize.col("TeamsHome.name"), {[Op.like]: `${team_2[0]}%`}),
                                    Sequelize.where(Sequelize.col("TeamsAway.name"), {[Op.like]: `${team_1[0]}%`})]
                            },
                        ]}
                ]

            },
            include: [
                Matches.TeamsHome, Matches.TeamsAway
            ]
        });
        res.json({rowCount: matchesByAbbrev.length, rows: matchesByFirstLetter});
    })
}