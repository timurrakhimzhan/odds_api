"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDaemon = exports.setFunctionMatchCreated = exports.setFinishedCrawling = void 0;
const actionTypes_1 = require("./actionTypes");
function setFinishedCrawling(value) {
    return {
        type: actionTypes_1.SET_FINISHED_CRAWLING,
        payload: { finishedCrawling: value }
    };
}
exports.setFinishedCrawling = setFinishedCrawling;
function setFunctionMatchCreated(value) {
    return {
        type: actionTypes_1.SET_FUNCTION_MATCH_CREATED,
        payload: { functionMatchCreated: value }
    };
}
exports.setFunctionMatchCreated = setFunctionMatchCreated;
function setDaemon(value) {
    return {
        type: actionTypes_1.SET_DAEMON,
        payload: { daemon: value }
    };
}
exports.setDaemon = setDaemon;
