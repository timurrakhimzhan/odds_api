import {BelongsTo, DataTypes, HasMany, Model, Sequelize} from "sequelize";
import {Sports} from "./sports";
import {Leagues} from "./leagues";
import {Matches} from "./matches";

export class Seasons  extends Model {
    static Sports: BelongsTo<Seasons, Sports>;
    static Leagues: BelongsTo<Seasons, Leagues>;
    static Matches: HasMany<Seasons, Matches>;
}
export function initSeasons(sequelize: Sequelize) {
    Seasons.init({
        name: DataTypes.STRING
    }, {tableName: 'seasons', sequelize});

    Sports.Seasons = Sports.hasMany(Seasons, {foreignKey: {name: "sports_id", allowNull: false}, sourceKey: "id"});
    Seasons.Sports = Seasons.belongsTo(Sports, {foreignKey: {name: "sports_id", allowNull: false}, targetKey: "id"});

    Leagues.Seasons = Leagues.hasMany(Seasons, {foreignKey: {name: "leagues_id", allowNull: false}, sourceKey: "id"});
    Seasons.Leagues = Seasons.belongsTo(Leagues, {foreignKey: {name: "leagues_id", allowNull: false}, targetKey: "id"});
}