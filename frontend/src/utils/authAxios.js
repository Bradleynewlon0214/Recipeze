import axios from 'axios';
import { SERVER } from './server';

export const authAxios = axios.create({
    baseURL: SERVER,
    headers: {
        'Authorization': `Token ${localStorage.getItem("token")}`
    }
});