"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSeasons = exports.Seasons = void 0;
const sequelize_1 = require("sequelize");
const sports_1 = require("./sports");
const leagues_1 = require("./leagues");
class Seasons extends sequelize_1.Model {
}
exports.Seasons = Seasons;
function initSeasons(sequelize) {
    Seasons.init({
        name: sequelize_1.DataTypes.STRING
    }, { tableName: 'seasons', sequelize });
    sports_1.Sports.Seasons = sports_1.Sports.hasMany(Seasons, { foreignKey: { name: "sports_id", allowNull: false }, sourceKey: "id" });
    Seasons.Sports = Seasons.belongsTo(sports_1.Sports, { foreignKey: { name: "sports_id", allowNull: false }, targetKey: "id" });
    leagues_1.Leagues.Seasons = leagues_1.Leagues.hasMany(Seasons, { foreignKey: { name: "leagues_id", allowNull: false }, sourceKey: "id" });
    Seasons.Leagues = Seasons.belongsTo(leagues_1.Leagues, { foreignKey: { name: "leagues_id", allowNull: false }, targetKey: "id" });
}
exports.initSeasons = initSeasons;
