import axios from 'axios';
import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import {Message} from '@arco-design/web-vue';
import {getToken} from '@/utils/auth';

export interface HttpResponse<T = unknown> {
    status: number;
    msg: string;
    code: number;
    data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response: AxiosResponse<HttpResponse>) => {

        const {code, msg, data} = response.data;
        const url = response.config.url as string;
        const method = response.config.method as string;

        if (method === 'get' && url.includes('/api/file')) {
            return response;
        }

        if (code !== 20000) {
            Message.error({
                content: msg || 'Network malfunction, please try again later',
                duration: 5 * 1000,
            });
            return Promise.reject(new Error(msg || 'Network malfunction, please try again later.....'));
        }
        return {code, msg, data};
    },
    (error) => {
        Message.error({
            content: error.msg || 'Network malfunction, please try again later.....',
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);
