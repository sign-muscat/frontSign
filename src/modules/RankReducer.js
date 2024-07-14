import {createActions, handleActions} from "redux-actions";

/* 초기값 */
const initialState = {};

/* 액션 */
const GET_RANKS = 'rank/GET_RANKS';
const SUCCESS = 'rank/SUCCESS';

export const { rank : {getRanks, success}} = createActions({
    [GET_RANKS] : result => ({ ranks : result.data.rankings }),
    [SUCCESS] : () => ({success : true})
});

/* 리듀서 */
const RankReducer = handleActions({
    [GET_RANKS] : (state, {payload}) => payload,
    [SUCCESS] : (state, {payload}) => payload
}, initialState);

export default RankReducer;