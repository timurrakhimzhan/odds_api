"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sports_1 = require("./sports");
const custom_1 = require("./custom");
class Leagues extends custom_1.CustomModel {
}
exports.Leagues = Leagues;
function initLeagues(sequelize) {
    Leagues.init({
        name: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        }
    }, { sequelize, tableName: 'leagues' });
    sports_1.Sports.Leagues = sports_1.Sports.hasMany(Leagues, { foreignKey: { name: "sports_id", allowNull: false }, sourceKey: "id" });
    Leagues.Sports = Leagues.belongsTo(sports_1.Sports, { foreignKey: { name: "sports_id", allowNull: false }, targetKey: "id" });
}
exports.initLeagues = initLeagues;
