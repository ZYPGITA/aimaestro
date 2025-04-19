/**
 * If you use the template method for development, you can use the
 * unplugin-vue-components plugin to enable on-demand loading support.
 */
import Components from 'unplugin-vue-components/vite';
import {ArcoResolver} from 'unplugin-vue-components/resolvers';

export default function configArcoResolverPlugin() {
  return Components({
    dirs: [], // Avoid parsing src/components
    deep: false,
    resolvers: [ArcoResolver()],
  });
}
