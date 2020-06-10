import {MatchCrawled, MatchDB} from "../../typings";
import {selectLeaguesQ, selectMatchQ, selectMatchByStatusQ, selectTeamQ} from "./select";
import {createMatchesTableQ, createLeaguesTableQ, createSportsTableQ, createTeamsTableQ} from "./create";
import {insertMatchRowQ, insertTeamRowQ, insertLeagueRowQ, insertSportsRowQ} from "./insert";
import {updateMatchQ} from "./update";


export {selectLeaguesQ, selectMatchByStatusQ, selectTeamQ, selectMatchQ};
export {createSportsTableQ, createTeamsTableQ, createLeaguesTableQ, createMatchesTableQ}
export {insertSportsRowQ, insertLeagueRowQ, insertTeamRowQ, insertMatchRowQ};
export {updateMatchQ};