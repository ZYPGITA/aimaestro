import axios from 'axios';

export interface LoginData {
    username: string;
    password: string;
}

export const userLogin = (loginData: LoginData) => {
    return axios.post('/api/user/login', loginData)
}

export const userLogout = () => {
    return axios.post('/api/user/logout')
}


export const getUserInfo = () => {
    return axios.get('/api/user/info')
}
