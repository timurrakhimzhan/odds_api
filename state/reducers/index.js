"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const crawler_1 = require("./crawler");
exports.default = redux_1.combineReducers({ crawler: crawler_1.crawlerStateReducer });
