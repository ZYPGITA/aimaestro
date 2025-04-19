import {HOME_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const Home: AppRouteRecordRaw = {
    path: '/home',
    name: 'Home',
    component: HOME_LAYOUT,
    meta: {
        locale: 'Home',
        requiresAuth: true,
        icon: 'icon-home',
        order: 1,
    },
    children: []
};

export default Home;
