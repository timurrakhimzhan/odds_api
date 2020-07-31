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
exports.crawlLeague = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const sequelize_1 = require("sequelize");
const connectDB_1 = require("../database/connectDB");
const crawler_1 = require("./crawler");
const leagues_1 = require("../database/models/leagues");
function crawlLeague(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let sequelize = yield connectDB_1.connectDB();
        const browser = yield puppeteer_1.default.launch({ headless: true });
        const league = yield leagues_1.Leagues.findOne({ where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('lower', sequelize_1.Sequelize.col('name')), sequelize_1.Sequelize.fn('lower', name)) });
        if (league) {
            yield crawler_1.crawler(browser, league);
        }
        yield browser.close();
        yield sequelize.close();
    });
}
exports.crawlLeague = crawlLeague;
if ((require === null || require === void 0 ? void 0 : require.main) === module) {
    crawlLeague("nba").then();
}
