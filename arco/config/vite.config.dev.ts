import {mergeConfig} from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';
import configVisualizerPlugin from "./plugin/visualizer";
import configArcoResolverPlugin from "./plugin/arcoResolver";
import configCompressPlugin from "./plugin/compress";

export default mergeConfig(
    {
        mode: 'development',
        plugins: [
            eslint({
                cache: false,
                include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
                exclude: ['node_modules'],
            }),
            configCompressPlugin('gzip'),
            configVisualizerPlugin(),
            configArcoResolverPlugin(),
        ],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        arco: ['@arco-design/web-vue'],
                        chart: ['echarts', 'vue-echarts'],
                        vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
                    },
                },
            },
            chunkSizeWarningLimit: 2000,
        },
    },
    baseConfig
);
