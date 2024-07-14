import {createActions, handleActions} from "redux-actions";

/* 초기값 */
const initialState = {
    wordList: [],
    wordImage: null,
    wordVideo: null
};

/* 액션 */
const GET_WORDS = 'game/GET_WORDS';
const GET_WORD_IMAGE = 'game/GET_WORD_IMAGE';
const GET_WORD_VIDEO = 'game/GET_WORD_VIDEO';

export const { game : {getWords, getWordImage, getWordVideo}} = createActions({
    [GET_WORDS] : result => ({ wordList : result.data }),
    [GET_WORD_IMAGE] : result => ({ wordImage : result.data.wordImg }),
    [GET_WORD_VIDEO] : result => ({ wordVideo : result.data })
});

/* 리듀서 */
const GameReducer = handleActions({
    [GET_WORDS] : (state, {payload}) => ({...state, wordList: payload.wordList}),
    [GET_WORD_IMAGE] : (state, {payload}) => ({...state, wordImage: payload.wordImage}),
    [GET_WORD_VIDEO] : (state, {payload}) => ({...state, wordVideo: payload.wordVideo})
}, initialState);

export default GameReducer;