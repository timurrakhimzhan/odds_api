import {BelongsTo, DataTypes, HasMany, Model, Sequelize} from "sequelize";
import {Sports} from "./sports";
import {CustomModel} from "./custom";
import {Teams} from "./teams";
import {Seasons} from "./seasons";
import {Matches} from "./matches";


export class Leagues extends CustomModel {
    static Sports: BelongsTo<Leagues, Sports>;
    static Teams: HasMany<Leagues, Teams>;
    static Seasons: HasMany<Leagues, Seasons>;
    static Matches: HasMany<Leagues, Matches>;
}

export function initLeagues(sequelize: Sequelize) {
    Leagues.init({
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {sequelize, tableName: 'leagues'});

    Sports.Leagues = Sports.hasMany(Leagues, {foreignKey: {name: "sports_id", allowNull: false}, sourceKey: "id"});
    Leagues.Sports = Leagues.belongsTo(Sports, {foreignKey: {name: "sports_id", allowNull: false}, targetKey: "id"});
}