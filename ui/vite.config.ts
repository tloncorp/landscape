import packageJson from './package.json';
import { loadEnv, defineConfig } from 'vite';
import analyze from 'rollup-plugin-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import { urbitPlugin } from '@urbit/vite-plugin-urbit';
import { fileURLToPath } from 'url';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env.VITE_STORAGE_VERSION =
    mode === 'development' ? Date.now().toString() : packageJson.version;

  Object.assign(process.env, loadEnv(mode, process.cwd()));
  const SHIP_URL =
    process.env.SHIP_URL ||
    process.env.VITE_SHIP_URL ||
    'http://localhost:8080';
  console.log(SHIP_URL);

  return defineConfig({
    base: mode === 'mock' ? undefined : '/apps/grid/',
    server: mode === 'mock' ? undefined : { https: true },
    build:
      mode !== 'profile'
        ? {
            rollupOptions: {
              external: 'node-fetch',
            },
          }
        : {
            rollupOptions: {
              plugins: [
                analyze({
                  limit: 20,
                }),
                visualizer(),
              ],
            },
          },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins:
      mode === 'mock'
        ? [basicSsl(), react()]
        : [
            basicSsl(),
            urbitPlugin({
              base: 'grid',
              target: SHIP_URL,
              changeOrigin: true,
              secure: false,
            }),
            react(),
          ],
  });
};
