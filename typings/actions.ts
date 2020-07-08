import {Action} from "redux";
import {CrawlerState} from "./states";

export interface CrawlerAction extends Action{
    payload: CrawlerState
}