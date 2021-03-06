"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.crawlSeason = void 0;
const fetchingService_1 = require("../services/fetchingService");
const cheerio = __importStar(require("cheerio"));
const databaseRequests_1 = require("./databaseRequests");
const store_1 = __importDefault(require("../state/store"));
const moment_1 = __importDefault(require("moment"));
const crawler_1 = require("../state/actions/crawler");
const matches_1 = require("../database/models/matches");
const sequelize_1 = __importDefault(require("sequelize"));
function crawlSeason(page, league, season) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = league.get("url");
        const lastMatch = yield matches_1.Matches.findOne({ include: [
                {
                    association: matches_1.Matches.Leagues,
                    where: {
                        name: league.get("name")
                    }
                },
                {
                    association: matches_1.Matches.Status,
                    where: sequelize_1.default.where(sequelize_1.default.fn('lower', sequelize_1.default.col('Status.name')), sequelize_1.default.fn('lower', "finished")),
                },
                { association: matches_1.Matches.TeamsHome }, { association: matches_1.Matches.TeamsAway }
            ], order: [["start_date", "DESC"]] });
        while (true) {
            const currentPage = yield fetchingService_1.getPage(page);
            console.log("----------------------------------");
            console.log(`The crawler is on the ${currentPage}th page`);
            console.log("----------------------------------");
            const content = yield page.content();
            const $ = cheerio.load(content);
            let date;
            if ($('#emptyMsg').length) {
                break;
            }
            $('#tournamentTable tr').each((i, el) => {
                if ($(el).hasClass('center')) {
                    date = $(el).find('.datet').text();
                    if (date.includes(",")) {
                        date = date.split(",")[1].trim() + " " + (new Date()).getFullYear();
                    }
                    return true;
                }
                if ($(el).attr("xeid")) {
                    if ($(el).find('.table-participant .live-odds-ico-prev').length > 0) { //if in play
                        return true;
                    }
                    let time = $(el).find('.table-time').text();
                    let [teamCrawled_1, teamCrawled_2] = $(el).find('.table-participant').text().split(' - ')
                        .map(team => team.trim());
                    let [scoreCrawled_1, scoreCrawled_2] = $(el).find('.table-score').text().split(':')
                        .map(score => parseInt(score));
                    let [coeffCrawled_1, coeffCrawled_2] = [$(el).find('.odds-nowrp').first().text(),
                        $(el).find('.odds-nowrp').last().text()].map(coeff => parseFloat(coeff));
                    const statusCrawled = $(el).find('.result-ok').length > 0 ? "finished" : "progress";
                    let matchUrl = (new URL(url)).origin + $(el).find('.table-participant a').attr('href');
                    const datetime = moment_1.default(`${date} ${time}Z`, "DD MMMM YYYY HH:mm ZZ");
                    if (isNaN(coeffCrawled_1) || isNaN(coeffCrawled_2))
                        return true;
                    if (lastMatch
                        && teamCrawled_1 === lastMatch.get("TeamsHome").get("name")
                        && teamCrawled_2 === lastMatch.get("TeamsAway").get("name")
                        && scoreCrawled_1 === lastMatch.get("home_score")
                        && scoreCrawled_2 === lastMatch.get("away_score")
                        && Math.abs(moment_1.default.duration(moment_1.default(datetime, "DD MMMM YYYY HH:mm ZZ").diff(lastMatch.get("start_date"))).asDays()) < 1) {
                        store_1.default.dispatch(crawler_1.setFinishedCrawling(true));
                        return false;
                    }
                    let matchCrawled = {
                        dateCrawled: datetime,
                        urlCrawled: matchUrl,
                        teamCrawled_1,
                        teamCrawled_2,
                        coeffCrawled_1,
                        coeffCrawled_2,
                        scoreCrawled_1,
                        scoreCrawled_2,
                        statusCrawled
                    };
                    databaseRequests_1.databaseRequests(matchCrawled, league, season).then((res) => {
                        if (res) {
                            console.log(res);
                        }
                    });
                }
            });
            const changed = yield fetchingService_1.changePage(page, false);
            let { crawler } = store_1.default.getState();
            if (crawler.finishedCrawling) {
                return;
            }
            if (!changed) {
                break;
            }
        }
    });
}
exports.crawlSeason = crawlSeason;
