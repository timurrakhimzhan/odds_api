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
exports.crawler = void 0;
const fetchingService_1 = require("../services/fetchingService");
const crawlerSeason_1 = require("./crawlerSeason");
const store_1 = __importDefault(require("../state/store"));
const seasons_1 = require("../database/models/seasons");
function crawler(browser, league) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        const url = league.get("url");
        const { crawler } = store_1.default.getState();
        const crawlerUrl = crawler.daemon ? url : url + "/results/";
        yield page.goto(crawlerUrl);
        yield fetchingService_1.changeTimezone(page);
        console.log("----------------------------------");
        console.log("Timezone changed");
        console.log("----------------------------------");
        let seasons = yield page.$$('.main-menu-gray .main-filter a');
        let seasonsNumber = seasons.length;
        for (let i = 0; i < seasonsNumber; i++) {
            seasons = yield page.$$('.main-menu-gray .main-filter a');
            yield seasons[i].click();
            yield page.waitForNavigation();
            yield fetchingService_1.pageLoaded(page);
            const seasonName = yield page.evaluate(() => {
                const container = document.querySelector(".main-menu-gray .main-filter .active");
                return container.innerText.split("/").join("-");
            });
            console.log(`We are currently on season ${seasonName}`);
            const [season] = yield seasons_1.Seasons.findOrCreate({
                where: {
                    name: seasonName,
                    sports_id: league.get("sports_id"),
                    leagues_id: league.get("id")
                }
            });
            yield crawlerSeason_1.crawlSeason(page, league, season);
            const { crawler } = store_1.default.getState();
            if (crawler.finishedCrawling) {
                break;
            }
        }
        yield page.close();
    });
}
exports.crawler = crawler;
