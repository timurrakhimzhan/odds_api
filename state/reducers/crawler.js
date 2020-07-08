"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var actionTypes_1 = require("../actions/actionTypes");
var initialState = {
    finishedCrawling: false,
    functionMatchCreated: false,
    daemon: false,
};
function crawlerStateReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actionTypes_1.SET_FINISHED_CRAWLING:
            return __assign(__assign({}, state), { finishedCrawling: action.payload.finishedCrawling });
        case actionTypes_1.SET_FUNCTION_MATCH_CREATED:
            return __assign(__assign({}, state), { functionMatchCreated: action.payload.functionMatchCreated });
        case actionTypes_1.SET_DAEMON:
            return __assign(__assign({}, state), { daemon: action.payload.daemon });
        default:
            return state;
    }
}
exports.crawlerStateReducer = crawlerStateReducer;
