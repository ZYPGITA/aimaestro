import {AppRouteRecordRaw} from '../types';

const Login: AppRouteRecordRaw = {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
        locale: 'Login',
        requiresAuth: false,
        order: 0,
    },
    children: []
};

export default Login;
