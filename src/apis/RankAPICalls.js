import {request} from "./api";
import {getRanks, success} from "../modules/RankReducer";
import {statusToastAlert} from "../utils/ToastUtils";

export const callRanksAPI = () => {
    return async (dispatch, getState) => {

        const result = await request(
            'GET',
            '/ranking'
        );
        console.log('callRanksAPI result : ', result);

        if(result.status === 200) {
            dispatch(getRanks(result));
        }
    }
}

export const callRegisterRankAPI = ({rankRequest}) => {
    return async (dispatch, getState) => {
        try {
            console.log("rankRequest: ", rankRequest);
            const result = await request(
                'POST',
                '/result',
                {'Content-Type' : 'application/json'},
                rankRequest
            );
            console.log('callRegisterRankAPI result : ', result);

            if(result.status === 201) {
                const title = '성공적으로 처리되었어요.';
                statusToastAlert(title, null, 'success');
                dispatch(success());
            }
        } catch {
            const title = '문제가 발생했어요.';
            const desc = '다시 시도해주세요.';
            statusToastAlert(title, desc, 'error');
        }

    }
}
