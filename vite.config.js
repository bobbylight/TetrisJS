import {defineConfig} from 'vite'
import {resolve} from 'path';
import pkg from './package.json';

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src/"),
        },
    },
    define: {
        'import.meta.env.VITE_BUILD_VERSION': JSON.stringify(pkg.version),
        'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toLocaleString()),
    },
    test: {
        environment: 'jsdom',
        // globals: true,
        setupFiles: ['./src/setupTests.ts'],
    },
});
