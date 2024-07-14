import axios from "axios";

const SERVER_IP = `localhost`;
const SERVER_PORT = `8000`;
const DEFAULT_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

export const request = async (method, url, headers, data) => {
    return await axios({
        method,
        url : `${DEFAULT_URL}${url}`,
        headers,
        data
    }).catch(error => console.log(error));
}
