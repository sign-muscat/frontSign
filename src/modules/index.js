import {combineReducers} from "redux";
import TestReducer from "./TestReducer";
import RankReducer from "./RankReducer";
const rootReducer = combineReducers({

    TestReducer,
    RankReducer
    
});

export default rootReducer;
