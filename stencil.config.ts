import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import dotenvPlugin from 'rollup-plugin-dotenv';

// https://stenciljs.com/docs/config

export const config: Config = {
  devServer: {
    initialLoadUrl: '/views/index.html',
    port: 3333
  },
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  outputTargets: [{
    dir: 'output',
    type: 'www',
    copy: [
      { src: 'views' },
      { src: 'backend' },
      { src: 'main.js' },
      { src: 'manifest.json' }
    ],
    serviceWorker: null
  }],
  plugins: [
    dotenvPlugin()
  ],
  rollupPlugins: {
    after: [
      nodePolyfills()
    ]
  }
};
