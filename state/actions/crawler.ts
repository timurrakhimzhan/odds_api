import {CrawlerAction} from "../../typings/actions";
import {SET_DAEMON, SET_FINISHED_CRAWLING, SET_FUNCTION_MATCH_CREATED} from "./actionTypes";

export function setFinishedCrawling(value: boolean): CrawlerAction {
    return {
        type: SET_FINISHED_CRAWLING,
        payload: { finishedCrawling: value }
    }
}

export function setFunctionMatchCreated(value: boolean): CrawlerAction {
    return {
        type: SET_FUNCTION_MATCH_CREATED,
        payload: { functionMatchCreated: value }
    }
}

export function setDaemon(value: boolean): CrawlerAction {
    return {
        type: SET_DAEMON,
        payload: { daemon: value }
    }
}