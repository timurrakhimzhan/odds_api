"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../actions/actionTypes");
const initialState = {
    finishedCrawling: false,
    functionMatchCreated: false,
    daemon: false,
};
function crawlerStateReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes_1.SET_FINISHED_CRAWLING:
            return Object.assign(Object.assign({}, state), { finishedCrawling: action.payload.finishedCrawling });
        case actionTypes_1.SET_FUNCTION_MATCH_CREATED:
            return Object.assign(Object.assign({}, state), { functionMatchCreated: action.payload.functionMatchCreated });
        case actionTypes_1.SET_DAEMON:
            return Object.assign(Object.assign({}, state), { daemon: action.payload.daemon });
        default:
            return state;
    }
}
exports.crawlerStateReducer = crawlerStateReducer;
