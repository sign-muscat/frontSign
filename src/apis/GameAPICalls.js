import {request} from "./api";
import {getRanks, success} from "../modules/RankReducer";
import {statusToastAlert} from "../utils/ToastUtils";
import {getWordImage, getWords} from "../modules/GameReducer";

export const callGetWordsAPI = (difficulty, count) => {
    return async (dispatch, getState) => {
        try {
            const queryString = `difficulty=${difficulty}&count=${count}`;

            /*TODO: Back 연결 후 테스트 시 주석 해제 */

            // const result = await request(
            //     'GET',
            //     `/get-words?${queryString}`
            // );
            // console.log('callGetWordsAPI result : ', result);
            //
            // if(result.status === 200) {
            //     dispatch((getWords(result)));
            // }
        } catch {
            const title = '문제가 발생했어요.';
            const desc = '다시 시도해주세요.';
            statusToastAlert(title, desc, 'error');
        }
    }
}

export const callGetWordImageAPI = (poseNumber) => {
    return async (dispatch, getState) => {
        try {
            const queryString = `word_no=${poseNumber}`;

            /*TODO: Back 연결 후 테스트 시 주석 해제 */

            // const result = await request(
            //     'GET',
            //     `/word_step?${queryString}`
            // );
            // console.log('callGetWordAPI result : ', result);
            //
            // if(result.status === 200) {
            //     dispatch((getWordImage(result)));
            // }
        } catch {
            const title = '문제가 발생했어요.';
            const desc = '다시 시도해주세요.';
            statusToastAlert(title, desc, 'error');
        }
    }
}