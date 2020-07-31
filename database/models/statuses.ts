import {CustomModel} from "./custom";
import {DataTypes, Sequelize, HasMany} from "sequelize";
import {Matches} from "./matches";


export class Statuses extends CustomModel {
    static Matches: HasMany<Statuses, Matches>;
}

export function initStatus(sequelize: Sequelize) {
    Statuses.init({
        name: DataTypes.STRING,
        other_name: DataTypes.STRING
    }, {sequelize, tableName: "statuses"})
}