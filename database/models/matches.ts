import {CustomModel} from "./custom";
import {BelongsTo, DataTypes, Sequelize} from "sequelize";
import {Statuses} from "./statuses";
import {Teams} from "./teams";
import {Sports} from "./sports";
import {Leagues} from "./leagues";
import {Seasons} from "./seasons";

export class Matches extends CustomModel {
    static Sports: BelongsTo<Matches, Sports>;
    static Leagues: BelongsTo<Matches, Leagues>;
    static Seasons: BelongsTo<Matches, Seasons>;
    static Status: BelongsTo<Matches, Statuses>;
    static TeamsHome: BelongsTo<Matches, Teams>;
    static TeamsAway: BelongsTo<Matches, Teams>;
}

export function initMatches(sequelize: Sequelize) {
    Matches.init({
        home_score: DataTypes.INTEGER,
        home_coeff: DataTypes.ARRAY(DataTypes.FLOAT),
        away_score: DataTypes.INTEGER,
        away_coeff: DataTypes.ARRAY(DataTypes.FLOAT),
        start_date: DataTypes.DATE,
        url: DataTypes.STRING
    }, {sequelize, tableName: "matches"});

    Sports.Matches = Sports.hasMany(Matches, {foreignKey: {name: "sports_id", allowNull: false}, sourceKey: "id"});
    Matches.Sports = Matches.belongsTo(Sports, {foreignKey: {name: "sports_id", allowNull: false}, targetKey: "id"});

    Leagues.Matches = Leagues.hasMany(Matches, {foreignKey: {name: "leagues_id", allowNull: false}, sourceKey: "id"});
    Matches.Leagues = Matches.belongsTo(Leagues, {foreignKey: {name: "leagues_id", allowNull: false}, targetKey: "id"});

    Seasons.Matches = Seasons.hasMany(Matches, {foreignKey: {name: "seasons_id", allowNull: false}, sourceKey: "id"});
    Matches.Seasons = Matches.belongsTo(Seasons, {foreignKey: {name: "seasons_id", allowNull: false}, targetKey: "id"});

    Statuses.Matches = Statuses.hasMany(Matches, {foreignKey: {name: "status_id", allowNull: false}, sourceKey: "id"});
    Matches.Status = Matches.belongsTo(Statuses, {foreignKey: {name: "status_id", allowNull: false}, targetKey: "id"});

    Teams.MatchesHome = Teams.hasMany(Matches, {foreignKey: {name: "home_id", allowNull: false}, sourceKey: "id", as: "MatchesHome"});
    Matches.TeamsHome = Matches.belongsTo(Teams, {foreignKey: {name: "home_id", allowNull: false}, targetKey: "id", as: "TeamsHome"});

    Teams.MatchesAway = Teams.hasMany(Matches, {foreignKey: {name: "away_id", allowNull: false}, sourceKey: "id", as: "MatchesAway"});
    Matches.TeamsAway = Matches.belongsTo(Teams, {foreignKey: {name: "away_id", allowNull: false}, targetKey: "id", as: "TeamsAway"});
}