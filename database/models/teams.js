"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTeams = exports.Teams = void 0;
const sequelize_1 = require("sequelize");
const leagues_1 = require("./leagues");
const sports_1 = require("./sports");
class Teams extends sequelize_1.Model {
}
exports.Teams = Teams;
function initTeams(sequelize) {
    Teams.init({
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        abbreviation: sequelize_1.DataTypes.STRING,
        other_names: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING)
    }, { sequelize, tableName: 'teams' });
    sports_1.Sports.Teams = sports_1.Sports.hasMany(Teams, { foreignKey: { name: "sports_id", allowNull: false }, sourceKey: "id" });
    Teams.Sports = Teams.belongsTo(sports_1.Sports, { foreignKey: { name: "sports_id", allowNull: false }, targetKey: "id" });
    leagues_1.Leagues.Teams = leagues_1.Leagues.hasMany(Teams, { foreignKey: { name: "leagues_id", allowNull: false }, sourceKey: "id" });
    Teams.Leagues = Teams.belongsTo(leagues_1.Leagues, { foreignKey: { name: "leagues_id", allowNull: false }, targetKey: "id" });
}
exports.initTeams = initTeams;
