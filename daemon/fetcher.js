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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetcher = void 0;
const store_1 = __importDefault(require("../state/store"));
const crawler_1 = require("../state/actions/crawler");
const connectDB_1 = require("../database/connectDB");
const leagues_1 = require("../database/models/leagues");
const crawler_2 = require("../crawler");
function fetcher() {
    return __awaiter(this, void 0, void 0, function* () {
        store_1.default.dispatch(crawler_1.setDaemon(true));
        const sequelize = yield connectDB_1.connectDB();
        const rows = yield leagues_1.Leagues.findAll();
        for (let row of rows) {
            const name = row.get("name");
            console.log(`Started League: ${name}`);
            yield crawler_2.crawlLeague(name);
            console.log(`Finished League: ${name}`);
        }
        yield sequelize.close();
    });
}
exports.fetcher = fetcher;
if (require.main === module) {
    fetcher();
}
