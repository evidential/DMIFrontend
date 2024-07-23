import { r as registerInstance, i as h, j as Host, k as getElement } from './index-2c9d06b4.js';
import { l as arrowDown, n as caretBackSharp } from './index-a1377cf8.js';
import { g as getIonMode, c as config, a as isPlatform } from './ionic-global-8c133cf7.js';
import { s as sanitizeDOMString } from './index-ef87ee48.js';
import { S as SPINNERS } from './spinner-configs-a37e628a.js';

const RefresherContent = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    if (this.pullingIcon === undefined) {
      const mode = getIonMode(this);
      const overflowRefresher = this.el.style.webkitOverflowScrolling !== undefined ? 'lines' : arrowDown;
      this.pullingIcon = config.get('refreshingIcon', mode === 'ios' && isPlatform('mobile') ? config.get('spinner', overflowRefresher) : 'circular');
    }
    if (this.refreshingSpinner === undefined) {
      const mode = getIonMode(this);
      this.refreshingSpinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'circular'));
    }
  }
  render() {
    const pullingIcon = this.pullingIcon;
    const hasSpinner = pullingIcon != null && SPINNERS[pullingIcon] !== undefined;
    const mode = getIonMode(this);
    return (h(Host, { class: mode }, h("div", { class: "refresher-pulling" }, this.pullingIcon && hasSpinner && (h("div", { class: "refresher-pulling-icon" }, h("div", { class: "spinner-arrow-container" }, h("ion-spinner", { name: this.pullingIcon, paused: true }), mode === 'md' && this.pullingIcon === 'circular' && (h("div", { class: "arrow-container" }, h("ion-icon", { icon: caretBackSharp })))))), this.pullingIcon && !hasSpinner && (h("div", { class: "refresher-pulling-icon" }, h("ion-icon", { icon: this.pullingIcon, lazy: false }))), this.pullingText !== undefined && (h("div", { class: "refresher-pulling-text", innerHTML: sanitizeDOMString(this.pullingText) }))), h("div", { class: "refresher-refreshing" }, this.refreshingSpinner && (h("div", { class: "refresher-refreshing-icon" }, h("ion-spinner", { name: this.refreshingSpinner }))), this.refreshingText !== undefined && (h("div", { class: "refresher-refreshing-text", innerHTML: sanitizeDOMString(this.refreshingText) })))));
  }
  get el() { return getElement(this); }
};

export { RefresherContent as ion_refresher_content };
