import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const System: AppRouteRecordRaw = {
    path: '/system',
    name: 'System',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'System',
        requiresAuth: true,
        icon: 'icon-settings',
        order: 9,
    },
    children: [
        {
            path: 'SystemNodeManagement',
            name: 'SystemNodeManagement',
            component: () => import('@/views/system/node_management/index.vue'),
            meta: {
                icon: 'icon-storage',
                locale: 'NodeManagement',
                requiresAuth: true,
                roles: ['*']
            }
        },
        {
            path: 'SystemServerManagement',
            name: 'SystemServerManagement',
            component: () => import('@/views/system/server_management/index.vue'),
            meta: {
                icon: 'icon-layers',
                locale: 'ServerManagement',
                requiresAuth: true,
                roles: ['*']
            }
        },
        {
            path: 'SystemTaskManagement',
            name: 'SystemTaskManagement',
            component: () => import('@/views/system/task_management/index.vue'),
            meta: {
                icon: 'icon-subscribe',
                locale: 'TaskManagement',
                requiresAuth: true,
                roles: ['*']
            }
        },
    ]
};

export default System;
