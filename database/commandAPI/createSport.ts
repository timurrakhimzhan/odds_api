import {questionPrompt} from "../../services/readline";
import {connectDB} from "../connectDB";
import {Sequelize} from "sequelize";
import {Sports} from "../models/sports";

async function main() {
    const sequelize: Sequelize = await connectDB();
    const sportName: string = await questionPrompt("Sport name:");
    await Sports.create({name: sportName});
    console.log(`Sport with name: ${sportName} has been added to database`);
    await sequelize.close();
}

if (require.main === module) {
    main();
}