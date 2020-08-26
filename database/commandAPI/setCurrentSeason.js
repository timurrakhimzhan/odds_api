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
const seasons_1 = require("../models/seasons");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = yield connectDB_1.connectDB();
        const seasonName = yield readline_1.questionPrompt("Season name:");
        yield seasons_1.Seasons.update({ current: true }, { where: { name: seasonName } });
        console.log(`Season ${seasonName} set to current`);
        yield sequelize.close();
    });
}
if (require.main === module) {
    main();
}
