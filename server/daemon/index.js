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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const select_1 = require("../../database/preparedQueries/select");
const store_1 = __importDefault(require("../../state/store"));
const crawler_1 = require("../../state/actions/crawler");
function process() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = {};
        const { rows } = (yield client.query(select_1.selectAllleaguesPQ()));
        for (let row of rows) {
            console.log(`Started League: ${row.name}`);
            // await crawlLeague(row.name, client);
            console.log(`Finished League: ${row.name}`);
        }
    });
}
function daemon() {
    return __awaiter(this, void 0, void 0, function* () {
        store_1.default.dispatch(crawler_1.setDaemon(true));
        yield process();
        console.log("Crawled. Waiting for an hour...");
        setTimeout(daemon, 1000 * 60 * 60);
    });
}
if ((require === null || require === void 0 ? void 0 : require.main) === module) {
    daemon();
}
