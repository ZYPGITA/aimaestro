/**
 * Theme import
 * https://github.com/arco-design/arco-plugins/blob/main/packages/plugin-vite-vue/README.md
 * https://arco.design/vue/docs/start
 */
import {vitePluginForArco} from '@arco-plugins/vite-vue';

export default function configArcoStyleImportPlugin() {
  return vitePluginForArco({});
}
