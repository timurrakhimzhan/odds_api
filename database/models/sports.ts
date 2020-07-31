import {DataTypes, HasMany, Model, Sequelize} from "sequelize";
import {Leagues} from "./leagues";
import {CustomModel} from "./custom";
import {Teams} from "./teams";
import {Matches} from "./matches";

export class Sports extends CustomModel{
    static Leagues: HasMany<Sports, Leagues>;
    static Teams: HasMany<Sports, Teams>;
    static Seasons: HasMany<Sports, Teams>;
    static Matches: HasMany<Sports, Matches>;
}

export function initSports(sequelize: Sequelize) {
    Sports.init({
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {sequelize, tableName: 'sports'});
}