import {createActions, handleActions} from "redux-actions";

/* 초기값 */
const initialState = {};

/* 액션 */
const GET_WORDS = 'game/GET_WORDS';
const GET_WORD_IMAGE = 'game/GET_WORD_IMAGE';

export const { game : {getWords, getWordImage}} = createActions({
    [GET_WORDS] : result => ({ words : result.data }),
    [GET_WORD_IMAGE] : result => ({ wordImage : result.data })
});

/* 리듀서 */
const GameReducer = handleActions({
    [GET_WORDS] : (state, {payload}) => payload,
    [GET_WORD_IMAGE] : (state, {payload}) => payload
}, initialState);

export default GameReducer;