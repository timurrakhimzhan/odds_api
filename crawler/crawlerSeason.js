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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var queries_1 = require("../database/queries");
var fetchingService_1 = require("../services/fetchingService");
var cheerio = __importStar(require("cheerio"));
function crawlSeason(page, client, league, seasons_id) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, lastMatch, finished, _loop_1, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = league.url;
                    return [4 /*yield*/, client.query(queries_1.selectMatchByStatusQ("finished"))];
                case 1:
                    response = _a.sent();
                    lastMatch = response.rows[0];
                    finished = false;
                    _loop_1 = function () {
                        var currentPage, content, $, date, changed;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fetchingService_1.getPage(page)];
                                case 1:
                                    currentPage = _a.sent();
                                    console.log("----------------------------------");
                                    console.log("The crawler is on the " + currentPage + "th page");
                                    console.log("----------------------------------");
                                    return [4 /*yield*/, page.content()];
                                case 2:
                                    content = _a.sent();
                                    $ = cheerio.load(content);
                                    if ($('#emptyMsg').length) {
                                        return [2 /*return*/, "break"];
                                    }
                                    $('#tournamentTable tr').each(function (i, el) {
                                        if ($(el).hasClass('center')) {
                                            date = $(el).find('.datet').text();
                                        }
                                        if ($(el).hasClass('deactivate')) {
                                            var time = $(el).find('.table-time').text();
                                            var _a = $(el).find('.table-participant').text().split(' - '), teamCrawled_1 = _a[0], teamCrawled_2 = _a[1];
                                            var _b = $(el).find('.table-score').text().split(':')
                                                .map(function (score) { return parseInt(score); }), scoreCrawled_1 = _b[0], scoreCrawled_2 = _b[1];
                                            var _c = [$(el).find('.odds-nowrp').first().text(),
                                                $(el).find('.odds-nowrp').last().text()].map(function (coeff) { return parseFloat(coeff); }), coeffCrawled_1 = _c[0], coeffCrawled_2 = _c[1];
                                            teamCrawled_1 = teamCrawled_1.split("").map(function (letter) { return letter == "'" ? "''" : letter; }).join("");
                                            teamCrawled_2 = teamCrawled_2.split("").map(function (letter) { return letter == "'" ? "''" : letter; }).join("");
                                            var matchUrl = (new URL(url)).origin + $(el).find('.table-participant a').attr('href');
                                            var datetime = date + " " + time + "+00";
                                            if (isNaN(coeffCrawled_1) || isNaN(coeffCrawled_2))
                                                return true;
                                            if (lastMatch && teamCrawled_1 === lastMatch.team_1 && teamCrawled_2 === lastMatch.team_2 && datetime === lastMatch.date) {
                                                finished = true;
                                                return false;
                                            }
                                            var matchCrawled = {
                                                dateCrawled: datetime,
                                                urlCrawled: matchUrl,
                                                teamCrawled_1: teamCrawled_1,
                                                teamCrawled_2: teamCrawled_2,
                                                coeffCrawled_1: coeffCrawled_1,
                                                coeffCrawled_2: coeffCrawled_2,
                                                scoreCrawled_1: scoreCrawled_1,
                                                scoreCrawled_2: scoreCrawled_2
                                            };
                                            databaseRequests(client, matchCrawled, league, seasons_id).then(function (res) {
                                                if (res) {
                                                    // console.log(res);
                                                }
                                            });
                                        }
                                    });
                                    return [4 /*yield*/, fetchingService_1.changePage(page, false)];
                                case 3:
                                    changed = _a.sent();
                                    if (finished || !changed) {
                                        console.log(changed, finished);
                                        return [2 /*return*/, "break"];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    state_1 = _a.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 4];
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.crawlSeason = crawlSeason;
function databaseRequests(client, matchCrawled, league, seasons_id) {
    return __awaiter(this, void 0, void 0, function () {
        var teamCrawled_1, teamCrawled_2, dateCrawled, coeffCrawled_1, coeffCrawled_2, scoreCrawled_1, scoreCrawled_2, id, sports_id, responseMatch, matchDB, _a, coeff_1, coeff_2, score_1, score_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    teamCrawled_1 = matchCrawled.teamCrawled_1, teamCrawled_2 = matchCrawled.teamCrawled_2, dateCrawled = matchCrawled.dateCrawled, coeffCrawled_1 = matchCrawled.coeffCrawled_1, coeffCrawled_2 = matchCrawled.coeffCrawled_2, scoreCrawled_1 = matchCrawled.scoreCrawled_1, scoreCrawled_2 = matchCrawled.scoreCrawled_2;
                    id = league.id, sports_id = league.sports_id;
                    return [4 /*yield*/, client.query(queries_1.selectMatchQ(matchCrawled))];
                case 1:
                    responseMatch = _b.sent();
                    if (!(responseMatch.rowCount === 0)) return [3 /*break*/, 3];
                    matchDB = {
                        date: dateCrawled,
                        leagues_id: id,
                        sports_id: sports_id,
                        url: matchCrawled.urlCrawled,
                        coeff_1: coeffCrawled_1,
                        coeff_2: coeffCrawled_2,
                        score_1: scoreCrawled_1,
                        score_2: scoreCrawled_2,
                        seasons_id: seasons_id
                    };
                    return [4 /*yield*/, client.query(queries_1.insertMatchRowQ(teamCrawled_1, teamCrawled_2, matchDB))];
                case 2:
                    _b.sent();
                    return [2 /*return*/, teamCrawled_1 + "-" + teamCrawled_2 + " " + dateCrawled + " added"];
                case 3:
                    _a = responseMatch.rows[0], coeff_1 = _a.coeff_1, coeff_2 = _a.coeff_2, score_1 = _a.score_1, score_2 = _a.score_2;
                    if (score_1 == scoreCrawled_1 && score_2 == scoreCrawled_1) {
                        return [2 /*return*/];
                    }
                    if (coeff_1[coeff_1.length - 1] === coeffCrawled_1 && coeff_2[coeff_2.length - 1] === coeffCrawled_2) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, client.query(queries_1.updateMatchQ(matchCrawled))];
                case 4:
                    _b.sent();
                    return [2 /*return*/, teamCrawled_1 + "-" + teamCrawled_2 + " " + dateCrawled + " updated"];
            }
        });
    });
}
