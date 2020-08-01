"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const sequelize_1 = require("sequelize");
const sports_1 = require("./models/sports");
const leagues_1 = require("./models/leagues");
const teams_1 = require("./models/teams");
const seasons_1 = require("./models/seasons");
const statuses_1 = require("./models/statuses");
const matches_1 = require("./models/matches");
dotenv.config({ path: `${__dirname}/../.env` });
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = new sequelize_1.Sequelize({
            username: process.env.user,
            host: process.env.host,
            database: process.env.database,
            password: process.env.password,
            port: parseInt(process.env.port),
            dialect: "postgres",
            logging: false
        });
        try {
            yield sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        sports_1.initSports(sequelize);
        leagues_1.initLeagues(sequelize);
        teams_1.initTeams(sequelize);
        seasons_1.initSeasons(sequelize);
        statuses_1.initStatus(sequelize);
        matches_1.initMatches(sequelize);
        yield sequelize.sync({ alter: true });
        return sequelize;
    });
}
exports.connectDB = connectDB;
