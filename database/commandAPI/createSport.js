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
const readline_1 = require("../../services/readline");
const connectDB_1 = require("../connectDB");
const sports_1 = require("../models/sports");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = yield connectDB_1.connectDB();
        const sportName = yield readline_1.questionPrompt("Sport name:");
        yield sports_1.Sports.create({ name: sportName });
        console.log(`Sport with name: ${sportName} has been added to database`);
        yield sequelize.close();
    });
}
if (require.main === module) {
    main();
}
