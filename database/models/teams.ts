import {DataTypes, Model, Sequelize, BelongsTo, HasMany} from "sequelize";
import {Leagues} from "./leagues";
import {Sports} from "./sports";
import {Matches} from "./matches";

export class Teams extends Model {
    static Sports: BelongsTo<Teams, Sports>;
    static Leagues: BelongsTo<Teams, Leagues>;
    static MatchesHome: HasMany<Leagues, Matches>;
    static MatchesAway: HasMany<Leagues, Matches>;
}
export function initTeams(sequelize: Sequelize) {
    Teams.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        abbreviation: DataTypes.STRING,
        other_names: DataTypes.ARRAY(DataTypes.STRING)
    }, {sequelize, tableName: 'teams'});

    Sports.Teams = Sports.hasMany(Teams, {foreignKey: {name: "sports_id", allowNull: false}, sourceKey: "id"});
    Teams.Sports = Teams.belongsTo(Sports, {foreignKey: {name: "sports_id", allowNull: false}, targetKey: "id"});

    Leagues.Teams = Leagues.hasMany(Teams, {foreignKey: {name: "leagues_id", allowNull: false}, sourceKey: "id"});
    Teams.Leagues = Teams.belongsTo(Leagues, {foreignKey: {name: "leagues_id", allowNull: false}, targetKey: "id"});
}