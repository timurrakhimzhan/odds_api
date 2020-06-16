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
Object.defineProperty(exports, "__esModule", { value: true });
var select_1 = require("../database/preparedQueries/select");
var insert_1 = require("../database/preparedQueries/insert");
var update_1 = require("../database/preparedQueries/update");
var create_1 = require("../database/queries/create");
function databaseRequests(client, matchCrawled, league, seasons_id, state) {
    return __awaiter(this, void 0, void 0, function () {
        var teamCrawled_1, teamCrawled_2, dateCrawled, coeffCrawled_1, coeffCrawled_2, scoreCrawled_1, scoreCrawled_2, responseMatch, matchDB, _a, coeff_1, coeff_2, score_1, score_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    teamCrawled_1 = matchCrawled.teamCrawled_1, teamCrawled_2 = matchCrawled.teamCrawled_2, dateCrawled = matchCrawled.dateCrawled, coeffCrawled_1 = matchCrawled.coeffCrawled_1, coeffCrawled_2 = matchCrawled.coeffCrawled_2, scoreCrawled_1 = matchCrawled.scoreCrawled_1, scoreCrawled_2 = matchCrawled.scoreCrawled_2;
                    return [4 /*yield*/, client.query(select_1.selectMatchPQ(matchCrawled))];
                case 1:
                    responseMatch = _b.sent();
                    if (!(responseMatch.rowCount === 0)) return [3 /*break*/, 5];
                    matchDB = {
                        date: dateCrawled,
                        url: matchCrawled.urlCrawled,
                        coeff_1: coeffCrawled_1,
                        coeff_2: coeffCrawled_2,
                        score_1: scoreCrawled_1,
                        score_2: scoreCrawled_2,
                    };
                    if (!!state.functionCreated) return [3 /*break*/, 3];
                    return [4 /*yield*/, client.query(create_1.createFunctionInsertMatch(matchDB))];
                case 2:
                    _b.sent();
                    state.functionCreated = true;
                    _b.label = 3;
                case 3: return [4 /*yield*/, client.query(insert_1.insertMatchRowPQ(teamCrawled_1, teamCrawled_2, league, seasons_id, matchDB))];
                case 4:
                    _b.sent();
                    return [2 /*return*/, teamCrawled_1 + "-" + teamCrawled_2 + " " + dateCrawled + " added"];
                case 5:
                    _a = responseMatch.rows[0], coeff_1 = _a.coeff_1, coeff_2 = _a.coeff_2, score_1 = _a.score_1, score_2 = _a.score_2;
                    if (parseInt(score_1) == scoreCrawled_1 && parseInt(score_2) == scoreCrawled_1) {
                        return [2 /*return*/];
                    }
                    if (parseFloat(coeff_1[coeff_1.length - 1]) === coeffCrawled_1 && parseFloat(coeff_2[coeff_2.length - 1]) === coeffCrawled_2) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, client.query(update_1.updateMatchPQ(matchCrawled))];
                case 6:
                    _b.sent();
                    return [2 /*return*/, teamCrawled_1 + "-" + teamCrawled_2 + " " + dateCrawled + " updated"];
            }
        });
    });
}
exports.databaseRequests = databaseRequests;
