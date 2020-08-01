import {Pool, Client} from 'pg';
import * as dotenv from 'dotenv';
import {Op, Sequelize} from "sequelize";
import {initSports} from "./models/sports";
import {initLeagues} from "./models/leagues";
import {initTeams} from "./models/teams";
import {initSeasons} from "./models/seasons";
import {initStatus} from "./models/statuses";
import {initMatches, Matches} from "./models/matches";
import moment from "moment";
dotenv.config({path: `${__dirname}/../.env`});


export async function connectDB(): Promise<Sequelize> {
    const sequelize: Sequelize = new Sequelize({
        username: process.env.user,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: parseInt(process.env.port as string),
        dialect: "postgres",
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    initSports(sequelize);
    initLeagues(sequelize);
    initTeams(sequelize);
    initSeasons(sequelize);
    initStatus(sequelize);
    initMatches(sequelize);

    await sequelize.sync({alter: true});
    return sequelize;

}
