"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSports = exports.Sports = void 0;
const sequelize_1 = require("sequelize");
const custom_1 = require("./custom");
class Sports extends custom_1.CustomModel {
}
exports.Sports = Sports;
function initSports(sequelize) {
    Sports.init({
        name: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, { sequelize, tableName: 'sports' });
}
exports.initSports = initSports;
