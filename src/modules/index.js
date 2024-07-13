import {combineReducers} from "redux";
import TestReducer from "./TestReducer";
import RankReducer from "./RankReducer";
import GameReducer from "./GameReducer";
const rootReducer = combineReducers({

    TestReducer,
    RankReducer,
    GameReducer
    
});

export default rootReducer;
