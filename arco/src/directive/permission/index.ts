import {DirectiveBinding} from 'vue';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
    const {value} = binding;


    if (Array.isArray(value)) {
        if (value.length > 0) {
            const boolPermission = true;

            // if (value[0] === userStore.role) {
            //     boolPermission = true;
            // }

            if (!boolPermission && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    } else {
        throw new Error(`need roles! Like v-permission="['admin']"`);
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding);
    },
};
