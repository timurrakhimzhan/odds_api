"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var crawler_1 = require("./crawler");
exports.default = redux_1.combineReducers({ crawler: crawler_1.crawlerStateReducer });
