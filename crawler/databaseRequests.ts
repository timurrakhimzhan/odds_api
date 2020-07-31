import {MatchCrawled, MatchDBQuery} from "../typings/crawler";
import {Matches} from "../database/models/matches";
import {Teams} from "../database/models/teams"
import {Leagues} from "../database/models/leagues";
import {Statuses} from "../database/models/statuses";
import {Seasons} from "../database/models/seasons";

export async function databaseRequests(matchCrawled: MatchCrawled, league: Leagues, season: Seasons): Promise<string | void> {

    let {teamCrawled_1, teamCrawled_2, dateCrawled, coeffCrawled_1, coeffCrawled_2, scoreCrawled_1, scoreCrawled_2, urlCrawled, statusCrawled} = matchCrawled;

    const [home]: [Teams, boolean] = await Teams.findOrCreate({
        where: {
            name: teamCrawled_1,
            sports_id: league.get("sports_id") as number,
            leagues_id: league.get("id") as number
        }
    });

    const [away]: [Teams, boolean] = await Teams.findOrCreate({
        where: {
            name: teamCrawled_2,
            sports_id: league.get("sports_id") as number,
            leagues_id: league.get("id") as number
        }
    });

    const [status]: [Statuses, boolean] = await Statuses.findOrCreate({
        where: {
            name: statusCrawled
        }
    });

    const match: Matches | null = await Matches.findOne({
        where: {
            home_id: home.get("id") as number,
            away_id: away.get("id") as number,
            start_date: dateCrawled.toDate(),
        }
    });


    if(!match) {
        await Matches.create({
                home_id: home.get("id") as number,
                leagues_id: league.get("id") as number,
                sports_id: league.get("sports_id") as number,
                status_id: status.get("id") as number,
                seasons_id: season.get("id") as number,
                home_score: scoreCrawled_1,
                home_coeff: [coeffCrawled_1],
                away_id: away.get("id") as number,
                away_score: scoreCrawled_2,
                away_coeff: [coeffCrawled_2],
                start_date: dateCrawled.toDate(),
                url: urlCrawled,
                status: statusCrawled
            });
        return `${teamCrawled_1}-${teamCrawled_2} ${dateCrawled} added`;
    } else {
        const [home_coeffs, away_coeffs] = [match.get("home_coeff"), match.get("away_coeff")] as [Array<number>, Array<number>];
        const [home_score, away_score] = [match.get("home_score"), match.get("away_score")] as [number, number];
        const status: string = match.get("status") as string;
        let [updatedHomeCoeff, updatedAwayCoeff] = [home_coeffs, away_coeffs];
        let [updatedHomeScore, updatedAwayScore] = [home_score, away_score];
        let updatedStatus = status;
        let updated: boolean = false;
        if(coeffCrawled_1 !== home_coeffs[home_coeffs.length - 1]) {
            updatedHomeCoeff = [...home_coeffs, coeffCrawled_1];
            updated = true;
        }
        if(coeffCrawled_2 !== away_coeffs[away_coeffs.length - 1]) {
            updatedAwayCoeff = [...away_coeffs, coeffCrawled_2];
            updated = true;
        }
        if(scoreCrawled_1 !== home_score) {
            updatedHomeScore = home_score;
            updated = true;
        }
        if(scoreCrawled_2 !== away_score) {
            updatedAwayScore = away_score;
            updated = true;
        }
        if(statusCrawled !== status) {
            updatedStatus = statusCrawled;
        }

        if(updated) {
            await match.update({
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
}