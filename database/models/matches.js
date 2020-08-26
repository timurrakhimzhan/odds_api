"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMatches = exports.Matches = void 0;
const custom_1 = require("./custom");
const sequelize_1 = require("sequelize");
const statuses_1 = require("./statuses");
const teams_1 = require("./teams");
const sports_1 = require("./sports");
const leagues_1 = require("./leagues");
const seasons_1 = require("./seasons");
class Matches extends custom_1.CustomModel {
}
exports.Matches = Matches;
function initMatches(sequelize) {
    Matches.init({
        home_score: sequelize_1.DataTypes.INTEGER,
        home_coeff: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.FLOAT),
        away_score: sequelize_1.DataTypes.INTEGER,
        away_coeff: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.FLOAT),
        start_date: sequelize_1.DataTypes.DATE,
        url: sequelize_1.DataTypes.STRING
    }, { sequelize, tableName: "matches" });
    sports_1.Sports.Matches = sports_1.Sports.hasMany(Matches, { foreignKey: { name: "sports_id", allowNull: false }, sourceKey: "id" });
    Matches.Sports = Matches.belongsTo(sports_1.Sports, { foreignKey: { name: "sports_id", allowNull: false }, targetKey: "id" });
    leagues_1.Leagues.Matches = leagues_1.Leagues.hasMany(Matches, { foreignKey: { name: "leagues_id", allowNull: false }, sourceKey: "id" });
    Matches.Leagues = Matches.belongsTo(leagues_1.Leagues, { foreignKey: { name: "leagues_id", allowNull: false }, targetKey: "id" });
    seasons_1.Seasons.Matches = seasons_1.Seasons.hasMany(Matches, { foreignKey: { name: "seasons_id", allowNull: false }, sourceKey: "id" });
    Matches.Seasons = Matches.belongsTo(seasons_1.Seasons, { foreignKey: { name: "seasons_id", allowNull: false }, targetKey: "id" });
    statuses_1.Statuses.Matches = statuses_1.Statuses.hasMany(Matches, { foreignKey: { name: "status_id", allowNull: false }, sourceKey: "id" });
    Matches.Status = Matches.belongsTo(statuses_1.Statuses, { foreignKey: { name: "status_id", allowNull: false }, targetKey: "id" });
    teams_1.Teams.MatchesHome = teams_1.Teams.hasMany(Matches, { foreignKey: { name: "home_id", allowNull: false }, sourceKey: "id", as: "MatchesHome" });
    Matches.TeamsHome = Matches.belongsTo(teams_1.Teams, { foreignKey: { name: "home_id", allowNull: false }, targetKey: "id", as: "TeamsHome" });
    teams_1.Teams.MatchesAway = teams_1.Teams.hasMany(Matches, { foreignKey: { name: "away_id", allowNull: false }, sourceKey: "id", as: "MatchesAway" });
    Matches.TeamsAway = Matches.belongsTo(teams_1.Teams, { foreignKey: { name: "away_id", allowNull: false }, targetKey: "id", as: "TeamsAway" });
}
exports.initMatches = initMatches;
