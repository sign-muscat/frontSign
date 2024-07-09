import axios from "axios";
import {getAccessTokenHeader, getRefreshTokenHeader, removeToken, saveToken} from "../utils/TokenUtils";
import {statusToastAlert} from "../utils/ToastUtils";
import store from "../store";
import {setRedirectPath} from "../modules/NavigationModules";

const SERVER_IP = `${process.env.REACT_APP_RESTAPI_SERVER_IP}`;
const DEFAULT_URL = `${SERVER_IP}`;

export const request = async (method, url, headers, data) => {
    return await axios({
        method,
        url : `${DEFAULT_URL}${url}`,
        headers,
        data
    }).catch(error => console.log(error));
}
