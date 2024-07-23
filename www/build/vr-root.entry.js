import { r as registerInstance, i as h } from './index-2c9d06b4.js';
import './index-703ec2af.js';
import { t as toastController } from './overlays-fa8a2177.js';
import './utils-c3441782.js';
import './animation-e7535a9b.js';
import './helpers-1c8dbf20.js';
import './index-5aa6aa3e.js';
import './ios.transition-5b777a3c.js';
import './index-786f3821.js';
import './md.transition-ad6c82bd.js';
import './cubic-bezier-1ddfda32.js';
import './index-20a27e5b.js';
import './ionic-global-8c133cf7.js';
import './index-ef87ee48.js';
import './index-8b628d3f.js';
import './hardware-back-button-fa04d6e9.js';

const vrRootCss = "";

const VrRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service worker registered!');
      }).catch((error) => {
        console.warn('Error registering service worker:');
        console.warn(error);
      });
    }
  }
  componentDidLoad() {
    if (!navigator.serviceWorker)
      return;
    navigator.serviceWorker
      .getRegistration()
      .then(registration => {
      if (registration === undefined)
        return;
      registration.addEventListener('updatefound', async () => {
        const toast = await toastController.create({
          message: "New version available.",
          buttons: [{ text: `Install new version of DMI Manager App`, role: 'reload' }],
          duration: 0
        });
        await toast.present();
        const { role } = await toast.onWillDismiss();
        if (role === 'reload') {
          registration.waiting.postMessage("skipWaiting");
        }
      });
      if (registration === null || registration === void 0 ? void 0 : registration.active) {
        navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
      }
    });
  }
  render() {
    return (h("ion-app", null, h("ion-router", { root: "/" }, h("ion-route", { url: "/", component: "vr-main" })), h("ion-nav", null)));
  }
};
VrRoot.style = vrRootCss;

export { VrRoot as vr_root };
