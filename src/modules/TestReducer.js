import {createActions, handleActions} from "redux-actions";
const initialState = {};

/* 액션 */
const GET_ESTIMATES = 'estimate/GET_ESTIMATES';
const GET_ESTIMATE = 'estimate/GET_ESTIMATE';
const SUCCESS = 'estimate/SUCCESS';
const DELETED = 'estimate/DELETED';

export const { estimate : {getEstimates, getEstimate, success, deleted}} = createActions({
    [GET_ESTIMATES] : result => ({ estimates : result.data }),
    [GET_ESTIMATE] : result => ({ estimate : result.data }),
    [SUCCESS] : () => ({success : true}),
    [DELETED] : () => ({deleted : true})
});

/* 리듀서 */
const TestReducer = handleActions({
    [GET_ESTIMATES] : (state, {payload}) => payload,
    [GET_ESTIMATE] : (state, {payload}) => payload,
    [SUCCESS] : (state, {payload}) => payload,
    [DELETED] : (state, {payload}) => payload
}, initialState);
export default TestReducer;