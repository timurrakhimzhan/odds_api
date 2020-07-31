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
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../connectDB");
const readline_1 = require("../../services/readline");
const sequelize_1 = require("sequelize");
const leagues_1 = require("../models/leagues");
const sports_1 = require("../models/sports");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = yield connectDB_1.connectDB();
        const sportName = yield readline_1.questionPrompt("Sport name:");
        const leagueName = yield readline_1.questionPrompt("League name:");
        const url = yield readline_1.questionPrompt("URL of archived odds:");
        yield leagues_1.Leagues.create({
            name: leagueName,
            url,
            sports_id: yield sports_1.Sports.getId(sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('lower', sequelize_1.Sequelize.col('name')), sequelize_1.Sequelize.fn('lower', sportName)))
        });
        console.log(`Sport with name: ${sportName} and ${leagueName} has been added to database`);
        yield sequelize.close();
    });
}
if (require.main === module) {
    main();
}
