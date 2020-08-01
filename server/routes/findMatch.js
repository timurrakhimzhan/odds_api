"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createMessage_1 = require("../../services/createMessage");
const sequelize_1 = __importStar(require("sequelize"));
const matches_1 = require("../../database/models/matches");
const moment_1 = __importDefault(require("moment"));
function createFindMatchRoute(server, client) {
    server.get("/api/findMatch/:sport/:league/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { sport, league } = req.params;
        const { team_1, team_2, date, team_1_abbreviation, team_2_abbreviation } = req.query;
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
        const matchesByAbbrev = yield matches_1.Matches.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        start_date: {
                            [sequelize_1.Op.between]: [moment_1.default(date).subtract(1, "days").toDate(), moment_1.default(date).add(1, "days").toDate()]
                        }
                    },
                    { [sequelize_1.Op.or]: [
                            { [sequelize_1.Op.and]: [
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsHome.abbreviation"), team_1_abbreviation),
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsAway.abbreviation"), team_2_abbreviation)
                                ]
                            },
                            { [sequelize_1.Op.and]: [
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsHome.abbreviation"), team_2_abbreviation),
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsAway.abbreviation"), team_1_abbreviation)
                                ]
                            },
                        ] }
                ]
            },
            include: [
                matches_1.Matches.TeamsHome, matches_1.Matches.TeamsAway
            ],
            raw: true
        });
        if (matchesByAbbrev.length > 0) {
            res.json({ rowCount: matchesByAbbrev.length, rows: matchesByAbbrev });
            return;
        }
        const matchesByFirstLetter = yield matches_1.Matches.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        start_date: {
                            [sequelize_1.Op.between]: [moment_1.default(date).subtract(1, "days").toDate(), moment_1.default(date).add(1, "days").toDate()]
                        }
                    },
                    { [sequelize_1.Op.or]: [
                            { [sequelize_1.Op.and]: [
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsHome.name"), { [sequelize_1.Op.like]: `${team_1[0]}%` }),
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsAway.name"), { [sequelize_1.Op.like]: `${team_2[0]}%` })
                                ]
                            },
                            { [sequelize_1.Op.and]: [
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsHome.name"), { [sequelize_1.Op.like]: `${team_2[0]}%` }),
                                    sequelize_1.default.where(sequelize_1.default.col("TeamsAway.name"), { [sequelize_1.Op.like]: `${team_1[0]}%` })
                                ]
                            },
                        ] }
                ]
            },
            include: [
                matches_1.Matches.TeamsHome, matches_1.Matches.TeamsAway
            ]
        });
        res.json({ rowCount: matchesByAbbrev.length, rows: matchesByFirstLetter });
    }));
}
exports.default = createFindMatchRoute;
