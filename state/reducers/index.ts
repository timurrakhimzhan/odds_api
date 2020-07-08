import {combineReducers} from "redux";
import {crawlerStateReducer} from "./crawler";

export default combineReducers({crawler: crawlerStateReducer})