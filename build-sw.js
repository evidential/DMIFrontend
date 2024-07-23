import {injectManifest} from 'workbox-build';

await injectManifest({
  globDirectory: "www/",
  globPatterns: ["**/*.{json,ico,html,png,jpg,jpeg,gif,svg,js,txt,css}"],
  globIgnores: [
    'host.config.json'
  ],
  swDest: "www/sw.js",
  swSrc: "src/sw.js",
  injectionPointRegexp: /(const preCacheManifest = )\[\](;)/
});
