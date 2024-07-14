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



            // 서버와 연결되지 않았을 때 사용할 임의의 데이터
            const result = {
                status: 200,
                data: {
                    image: "/images/actionQuestion/normal/강아지_1.png"  // 임의의 이미지 URL
                }
            };
            console.log('API 파일 안에서 호출 !!! 되랏!!! : ', result);
            if (result.status === 200) {
                dispatch(getWordImage(result));  // 액션 호출
            }

        } catch {
            const title = '문제가 발생했어요.';
            const desc = '다시 시도해주세요.';
            statusToastAlert(title, desc, 'error');
        }
    }
}