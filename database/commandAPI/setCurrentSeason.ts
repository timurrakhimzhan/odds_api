import {Sequelize} from "sequelize";
import {connectDB} from "../connectDB";
import {questionPrompt} from "../../services/readline";
import {Seasons} from "../models/seasons";

async function main() {
    const sequelize: Sequelize = await connectDB();
    const seasonName: string = await questionPrompt("Season name:");
    await Seasons.update({current: true}, {where: {name: seasonName}});
    console.log(`Season ${seasonName} set to current`);
    await sequelize.close();
}

if (require.main === module) {
    main();
}