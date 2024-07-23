import { r as registerInstance, i as h } from './index-2c9d06b4.js';

const vrRootCss = "";

const VrRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("ion-app", null, h("ion-router", { root: "/" }, h("ion-route", { url: "/", component: "vr-main" })), h("ion-nav", null)));
  }
};
VrRoot.style = vrRootCss;

export { VrRoot as vr_root };
