import {CrawlerAction} from "../../typings/actions";
import {CrawlerState} from "../../typings/states";
import {SET_DAEMON, SET_FINISHED_CRAWLING, SET_FUNCTION_MATCH_CREATED} from "../actions/actionTypes";

const initialState: CrawlerState = {
    finishedCrawling: false,
    functionMatchCreated: false,
    daemon: false,
};

export function crawlerStateReducer(state: CrawlerState = initialState, action: CrawlerAction): CrawlerState {
    switch(action.type) {
        case SET_FINISHED_CRAWLING:
            return {...state, finishedCrawling: action.payload.finishedCrawling};
        case SET_FUNCTION_MATCH_CREATED:
            return {...state, functionMatchCreated: action.payload.functionMatchCreated};
        case SET_DAEMON:
            return {...state, daemon: action.payload.daemon};
        default:
            return state
    }
}