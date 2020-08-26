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
exports.databaseRequests = void 0;
const matches_1 = require("../database/models/matches");
const teams_1 = require("../database/models/teams");
const statuses_1 = require("../database/models/statuses");
function databaseRequests(matchCrawled, league, season) {
    return __awaiter(this, void 0, void 0, function* () {
        let { teamCrawled_1, teamCrawled_2, dateCrawled, coeffCrawled_1, coeffCrawled_2, scoreCrawled_1, scoreCrawled_2, urlCrawled, statusCrawled } = matchCrawled;
        const [home] = yield teams_1.Teams.findOrCreate({
            where: {
                name: teamCrawled_1,
                sports_id: league.get("sports_id"),
                leagues_id: league.get("id")
            }
        });
        const [away] = yield teams_1.Teams.findOrCreate({
            where: {
                name: teamCrawled_2,
                sports_id: league.get("sports_id"),
                leagues_id: league.get("id")
            }
        });
        const [status] = yield statuses_1.Statuses.findOrCreate({
            where: {
                name: statusCrawled
            }
        });
        const match = yield matches_1.Matches.findOne({
            where: {
                home_id: home.get("id"),
                away_id: away.get("id"),
                start_date: dateCrawled.toDate(),
            }
        });
        if (!match) {
            yield matches_1.Matches.create({
                home_id: home.get("id"),
                leagues_id: league.get("id"),
                sports_id: league.get("sports_id"),
                status_id: status.get("id"),
                seasons_id: season.get("id"),
                home_score: scoreCrawled_1 > 0 ? scoreCrawled_1 : null,
                home_coeff: coeffCrawled_1 > 0 ? [coeffCrawled_1] : null,
                away_id: away.get("id"),
                away_score: scoreCrawled_2 > 0 ? scoreCrawled_2 : null,
                away_coeff: coeffCrawled_2 > 0 ? [coeffCrawled_2] : null,
                start_date: dateCrawled.toDate(),
                url: urlCrawled,
                status: statusCrawled
            });
            return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} added`;
        }
        else {
            const [home_coeffs, away_coeffs] = [match.get("home_coeff"), match.get("away_coeff")];
            const [home_score, away_score] = [match.get("home_score"), match.get("away_score")];
            const status = match.get("status");
            let [updatedHomeCoeff, updatedAwayCoeff] = [home_coeffs, away_coeffs];
            let [updatedHomeScore, updatedAwayScore] = [home_score, away_score];
            let updatedStatus = status;
            let updated = false;
            if (coeffCrawled_1 !== home_coeffs[home_coeffs.length - 1]) {
                updatedHomeCoeff = [...home_coeffs, coeffCrawled_1];
                updated = true;
            }
            if (coeffCrawled_2 !== away_coeffs[away_coeffs.length - 1]) {
                updatedAwayCoeff = [...away_coeffs, coeffCrawled_2];
                updated = true;
            }
            if (scoreCrawled_1 !== home_score) {
                updatedHomeScore = home_score;
                updated = true;
            }
            if (scoreCrawled_2 !== away_score) {
                updatedAwayScore = away_score;
                updated = true;
            }
            if (statusCrawled !== status) {
                updatedStatus = statusCrawled;
            }
            if (updated) {
                yield match.update({
                    home_score: updatedHomeScore,
                    home_coeff: updatedHomeCoeff,
                    away_score: updatedAwayScore,
                    away_coeff: updatedAwayCoeff,
                    status: updatedStatus
                });
                return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} updated`;
            }
            return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} already in db`;
        }
    });
}
exports.databaseRequests = databaseRequests;
