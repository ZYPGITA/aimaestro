import {defineStore} from 'pinia';
import {LoginData, userLogin, userLogout, getUserInfo} from '@/api/user';
import {setToken, clearToken} from '@/utils/auth';
import {removeRouteListener} from '@/utils/route-listener';
import {UserState} from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        username: '',
        role: 'user'
    }),

    getters: {
        userInfo(state: UserState): UserState {
            return {...state};
        },
    },

    actions: {
        switchRoles() {
            return new Promise((resolve) => {
                this.role = this.role === 'user' ? 'admin' : 'user';
                resolve(this.role);
            });
        },
        // Set user's information
        setInfo(partial: Partial<UserState>) {
            this.$patch(partial);
        },

        // Reset user's information
        resetInfo() {
            this.$reset();
        },

        // Get user's information
        async info() {
            const res = await getUserInfo();
            this.setInfo(res.data);
        },

        // Login
        async login(loginForm: LoginData) {
            try {
                const res = await userLogin(loginForm);
                setToken(res.data.token);
                await this.info();
            } catch (err) {
                clearToken();
                throw err;
            }
        },
        logoutCallBack() {
            const appStore = useAppStore();
            this.resetInfo();
            clearToken();
            removeRouteListener();
            appStore.clearServerMenu();
        },
        // Logout
        async logout() {
            try {
                await userLogout();
            } finally {
                this.logoutCallBack();
            }
        },
    },
});

export default useUserStore;