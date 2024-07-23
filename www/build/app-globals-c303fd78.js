import { i as initialize } from './ionic-global-8c133cf7.js';

// import { setupConfig } from '@ionic/core';
const appGlobalScript = () => {
  // setupConfig({
  //   mode: 'ios'
  // });
};

const globalScripts = () => {
  appGlobalScript();
  initialize();
};

export { globalScripts as g };
