import {connectDB} from "../connectDB";
import {questionPrompt} from "../../services/readline";
import {Sequelize} from "sequelize";
import {Leagues} from "../models/leagues";
import {Sports} from "../models/sports";


async function main() {
    const sequelize: Sequelize = await connectDB();
    const sportName: string = await questionPrompt("Sport name:");
    const leagueName: string = await questionPrompt("League name:");
    const url: string = await questionPrompt("URL of archived odds:");

    await Leagues.create({
        name: leagueName,
        url,
        sports_id: await Sports.getId(Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', sportName)))
    });

    console.log(`Sport with name: ${sportName} and ${leagueName} has been added to database`);
    await sequelize.close();
}

if (require.main === module) {
    main();
}