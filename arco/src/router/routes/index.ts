import type {RouteRecordNormalized} from 'vue-router';

const modules = import.meta.glob('./modules/*.ts', {eager: true});
const externalModules = import.meta.glob('./externalModules/*.ts', {
    eager: true,
});

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
    Object.keys(_modules).forEach((key) => {
        const defaultModule = _modules[key].default;
        if (!defaultModule) return;
        const moduleList = Array.isArray(defaultModule)
            ? [...defaultModule]
            : [defaultModule];
        result.push(...moduleList);
    });
    return result;
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
    externalModules,
    []
);


export const getMenuList = () => {
    const appRouteJson = [] as any;

    appRoutes.forEach((item) => {
        const children = [] as any;
        item.children.forEach((item2) => {
            children.push({
                'path': item2.path,
                'name': item2.name,
                'meta': item2.meta,
            })
        })
        appRouteJson.push({
            'name': item.name,
            'path': item.path,
            'meta': item.meta,
            'children': children
        })
    })
    return appRouteJson;
}