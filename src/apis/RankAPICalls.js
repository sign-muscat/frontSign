import {request} from "./api";
import {success} from "../modules/RankReducer";
import {statusToastAlert} from "../utils/ToastUtils";

export const callRegisterRankAPI = ({rankRequest}) => {
    return async (dispatch, getState) => {
        try {
            /* back api 구현 이후에 연결 예정 */
            // const result = await request(
            //     'POST',
            //     '/back-end-link',
            //     {'Content-Type' : 'application/json'},
            //     JSON.stringify(rankRequest)
            // );
            // console.log('callRegisterRankAPI result : ', result);
            //
            // if(result.status === 201) {
            //     const title = '성공적으로 처리되었어요.';
            //     statusToastAlert(title, null, 'success');
            //     dispatch(success());
            // }
        } catch {
            const title = '문제가 발생했어요.';
            const desc = '다시 시도해주세요.';
            statusToastAlert(title, desc, 'error');
        }

    }
}
