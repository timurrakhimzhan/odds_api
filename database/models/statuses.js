"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStatus = exports.Statuses = void 0;
const custom_1 = require("./custom");
const sequelize_1 = require("sequelize");
class Statuses extends custom_1.CustomModel {
}
exports.Statuses = Statuses;
function initStatus(sequelize) {
    Statuses.init({
        name: sequelize_1.DataTypes.STRING,
        other_name: sequelize_1.DataTypes.STRING
    }, { sequelize, tableName: "statuses" });
}
exports.initStatus = initStatus;
