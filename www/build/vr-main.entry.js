import { r as registerInstance, i as h, k as getElement } from './index-2c9d06b4.js';
import './index-703ec2af.js';
import { c as config, l as lodash, d as debounce } from './lodash-8bd05c1a.js';
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

const vrMainCss = ".splash{background-color:#000;display:flex;align-items:center;justify-content:center;height:100vh;opacity:0;transition:opacity 600ms ease-out;position:relative;pointer-events:none;z-index:1000}.splash--show{opacity:1}.perspective{width:100%;height:100%;position:absolute;top:0}.container{min-height:100%;position:relative;transform:translateZ(0) translateX(0) rotateY(0deg)}.container::after{content:'';position:absolute;top:0;left:0;width:100%;height:0;opacity:0;background:rgba(0,0,0,0.2);transition:opacity 0.4s, height 0s 0.4s}.wrapper{background-color:#000;color:#fff;height:100vh;width:100vw}model-viewer{background-color:#18212b;height:100vh;width:100vw}.environment-navigation{display:none;position:absolute;left:20px;bottom:0;width:17vh;z-index:1}.environment-link-name{font-size:2.5vh;font-weight:bold;text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;margin:0 0 5px}.environment-container{margin:0 0 10px}.environment-container img{border:3px solid #000;border-radius:5px;opacity:0.5}.environment-container img.environment-active{border:3px solid #fff;opacity:1}.toggle{font-size:calc(5em + 10vw);display:block;position:relative;width:60px;height:40px;border-radius:0.5em;border:0.015em solid #000;background-image:linear-gradient(#f2f2f2, #fff, #f2f2f2);margin:0.08em 0.15em;cursor:pointer;filter:drop-shadow(0.015em 0.015em 0.01em rgba(0, 0, 0, 0.3))}.toggle-btn::after{position:absolute;top:-56px;left:-40px;font-size:0.35em;text-align:center;transition:all 500ms cubic-bezier(0.34, 0.78, 0.55, 1.4)}.toggle-checkbox{position:absolute;visibility:hidden}.toggle-checkbox:checked+.toggle-btn::after{left:0}.toggle--fire-intensity .toggle-btn::after{background-image:url('../assets/images/flame-small.png');background-size:90px 110px;content:'';display:inline-block;width:90px;height:110px}.toggle--fire-intensity .toggle-checkbox:checked+.toggle-btn::after{background-image:url('../assets/images/flame-large.png');background-size:90px 110px;content:'';display:inline-block;width:90px;height:110px}.fire-toggle{height:120px;width:155px;display:flex;align-items:center;justify-content:center}.fire-toggle-button{display:flex;align-items:center;justify-content:center;color:black;font-weight:bold;font-size:46px;background-color:#fff;border:4px solid #000;height:110px;width:110px;border-radius:100%;background-size:cover}.fire-toggle-button--enabled{background-color:#d24d0e;background-image:url('../assets/images/fire.png');box-shadow:rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px}.fire-toggle-button--disabled{background-color:#5d5b59;background-image:url('../assets/images/smoke.png')}.perspective.modalview{position:fixed;-webkit-perspective:1000px;perspective:1000px}.modalview .container{position:absolute;overflow:hidden;width:100%;height:100%;cursor:pointer;backface-visibility:hidden}.modalview .wrapper{transform:translateZ(-1px);}.animate .container::after{opacity:1;height:101%;transition:opacity 0.3s}.outer-nav{position:absolute;height:auto;font-size:2em;pointer-events:none;width:20vw}.outer-nav.vertical{bottom:5vh;top:10vh;transform:translateY(-5vh);transform-style:preserve-3d}.outer-nav.right{right:2vw}.outer-nav a{display:inline-block;white-space:nowrap;font-weight:300;margin:0 0 30px 0;color:#fff;-webkit-transition:color 0.3s;transition:color 0.3s;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.outer-nav a:hover{color:#ffdccd}.outer-nav.vertical a{display:block}.outer-nav.horizontal a{margin:15px 20px}.outer-nav a::before{display:inline-block;speak:none;font-style:normal;font-weight:normal;font-variant:normal;text-transform:none;line-height:1;margin-right:10px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-backface-visibility:hidden;backface-visibility:hidden}.effect-rotateleft{background-image:radial-gradient(#4f85e9, var(--ion-color-dark))}.effect-rotateleft .container{-webkit-transition:-webkit-transform 0.4s;transition:transform 0.4s;-webkit-transform-origin:0% 50%;transform-origin:0% 50%}.effect-rotateleft .container::after{background:rgba(255,255,255,0.1)}.effect-rotateleft.animate .container{border-radius:20px;border:10px solid black;transform:translateZ(-100px) translateX(0%) rotateY(30deg)}.effect-rotateleft.animate .outer-nav{overflow:scroll;pointer-events:all}.effect-rotateleft .outer-nav label,.effect-rotateleft .outer-nav div{opacity:0;-webkit-transform:translateX(350px) translateZ(-1000px);transform:translateX(350px) translateZ(-1000px);-webkit-transition:-webkit-transform 0.4s, opacity 0.4s;transition:transform 0.4s, opacity 0.4s}.effect-rotateleft.animate .outer-nav div,.effect-rotateleft.animate .outer-nav label{opacity:1;-webkit-transform:translateX(0) translateZ(0);transform:translateX(0) translateZ(0)}ion-toast{font-size:20px;font-weight:bold;text-align:center}.seizable-item-card{position:absolute;right:20px;top:0;z-index:2;transition:transform 1500ms ease;-webkit-backface-visibility:hidden;backface-visibility:hidden}.seizable-item-card.active-item{transform:perspective(1000px) rotateY(180deg)}.seizable-item-card.active-item.flipped{transform:perspective(1000px) rotateY(0deg)}.seizable-item-card.seizable-item-list{transform:perspective(1000px) rotateY(0deg)}.seizable-item-card.seizable-item-list.flipped{transform:perspective(1000px) rotateY(-180deg)}.seizable-item-card.active-item ion-card-content{display:flex;flex-direction:column;align-items:center}.seizable-item-card.active-item.seized ion-card-content:after{background-image:url('../assets/images/seized.png');background-size:85%;background-repeat:no-repeat;background-position:50% 0;content:'';z-index:1;position:absolute;left:0;right:0;top:0;bottom:0}.seizable-item-card ion-card>img{height:100px;width:100%}.seizable-item-card.active-item img.active-item-image{filter:drop-shadow(1px 3px 4px black);height:10vh;margin:5px 0 0}.seizable-item-card.active-item h3{text-align:center;font-size:16px;font-weight:600}.seizable-item-card .card-content{background-color:#fff;height:calc(45vh - 130px);min-height:180px}.seizable-item-card .no-items{font-size:3vh;text-align:center;display:flex;align-items:center;height:25vh;padding:20px}.seizable-item-card ion-card{border:3px solid black;height:45vh;min-height:280px;width:20vw;background-color:#fff}.seizable-item-card ion-list{height:100%;overflow:scroll}.seizable-item-card ion-list ion-label h3{font-weight:500}.seizable-item-card .environment-name{position:absolute;top:5vh;left:20px;right:20px;text-align:center;font-size:2.3vw;color:#fff;text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;z-index:1}.seizable-item-card ion-button{position:absolute;right:0;left:0;bottom:0;height:6vh;font-size:2.5vh}.seizable-item{--padding-start:10px}.seizable-item ion-thumbnail{filter:drop-shadow(1px 3px 4px black);height:44px;width:44px;margin:0 15px 0 0}.seizable-item.seized ion-label{background-size:85%;background-image:url(../assets/images/seized.png);background-position:50%;background-repeat:no-repeat}";

const VrMain = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.timer = null;
    this.interval = 500;
    this.initialDelay = 7000;
    this.elapsedTime = 0;
    this.EnvironmentLink = (props) => (h("div", { class: "environment-container", onClick: () => this.setActiveEnvironment(props.environment.id) }, h("div", { class: "environment-link-name" }, `${config.environments[props.environment.id].name}`), h("img", { class: props.activeEnvironment, src: `../assets/images/${config.environments[props.environment.id].image}` })));
    this.SeizableListItem = (props) => (h("ion-item", { class: `seizable-item ${props.item.seized === true && 'seized'}`, lines: "full" }, h("ion-thumbnail", null, h("img", { alt: props.item.name, src: `${this.fileServerPath}/images/${props.item.image}` })), h("ion-label", null, h("h3", null, props.item.name), h("p", null, props.item.info)), props.item.seized === true &&
      h("ion-icon", { color: "dark", src: `${this.fileServerPath}/ionicons/briefcase.svg`, slot: "end" })));
    this.menuOpen = false;
    this.showSplash = true;
    this.fireSpeed = 0;
    this.fireEnabled = false;
    this.fileServerHasStarted = false;
    this.fileServerPath = '';
    this.activeEnvironment = 0;
    this.userEnvironment = 0;
    this.seizableItemList = [];
  }
  async markerAddedHandler(event) {
    await this.itemSeized(event.detail);
  }
  async componentWillLoad() {
    this.seizableItemList = lodash.cloneDeep(config.seizableItems);
    front.on('file server started', fileServerPath => {
      this.fileServerHasStarted = true;
      this.fileServerPath = fileServerPath;
    });
    front.on('teleported to area', debounce(async (areaData) => {
      if (this.activeEnvironment !== areaData.AreaIndex)
        await this.presentToast(`User has moved to ${config.environments[areaData.AreaIndex].name}`);
      this.activeEnvironment = areaData.AreaIndex;
      this.userEnvironment = areaData.AreaIndex;
    }, 500, true));
    front.on('reset for new user', debounce(async () => {
      this.activeEnvironment = 0;
      this.userEnvironment = 0;
      this.seizableItemList = lodash.cloneDeep(config.seizableItems);
      const vrScene = this.el.querySelector('vr-scene');
      if (vrScene)
        vrScene.resetScene();
      await this.presentToast('New user session in progress');
    }, 500, true));
    front.send('ready');
  }
  async componentDidLoad() {
    this.startSplashTimer();
  }
  startSplashTimer() {
    if (this.timer === null) {
      this.timer = setInterval(this.checkVRSceneExists.bind(this), this.interval);
    }
  }
  stopSplashTimer() {
    clearInterval(this.timer);
    this.timer = null;
    this.elapsedTime = 0;
  }
  checkVRSceneExists() {
    const VRSceneEl = this.el.querySelector('vr-scene');
    this.elapsedTime += this.interval;
    if (this.elapsedTime >= this.initialDelay && VRSceneEl !== null) {
      this.showSplash = false;
      this.stopSplashTimer();
    }
  }
  toggleMenu(e) {
    const perspectiveWrapper = document.getElementById('perspective');
    if (this.menuOpen === false) {
      this.menuOpen = true;
      e.stopPropagation();
      if (e.cancelable)
        e.preventDefault();
      perspectiveWrapper.classList.add('modalview');
      setTimeout(function () {
        perspectiveWrapper.classList.add('animate');
      }, 25);
    }
    else if (this.menuOpen === true) {
      this.menuOpen = false;
      if (perspectiveWrapper.classList.contains('animate')) {
        const onEndTransFn = function (e) {
          if (e.target.class !== 'container' || e.propertyName.indexOf('transform') == -1)
            return;
          this.removeEventListener('transitionend', onEndTransFn);
          perspectiveWrapper.classList.remove('modalview');
        };
        perspectiveWrapper.addEventListener('transitionend', onEndTransFn);
      }
      perspectiveWrapper.classList.remove('animate');
    }
    perspectiveWrapper.addEventListener('mousedown', () => false);
  }
  async presentToast(message) {
    if (this.toast !== undefined)
      await this.toast.dismiss();
    this.toast = await toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await this.toast.present();
  }
  async itemSeized(detail) {
    const seizableItem = this.seizableItemList.find(item => item.id === detail.seizedItem.id);
    seizableItem.seized = detail.seizedItem.seized;
    const message = detail.message;
    this.seizableItemList = [...this.seizableItemList];
    await this.presentToast(message);
  }
  async setActiveEnvironment(id) {
    this.activeEnvironment = id;
    await this.presentToast(`User moved to ${config.environments[this.activeEnvironment].name}`);
  }
  mapEnvironments() {
    return config.environments.map(environment => {
      let activeEnvironment = '';
      if (environment.id === this.activeEnvironment)
        activeEnvironment = 'environment-active';
      return h(this.EnvironmentLink, { environment: environment, activeEnvironment: activeEnvironment });
    });
  }
  mapSeizableItems() {
    return this.seizableItemList.map(item => {
      return h(this.SeizableListItem, { item: item });
    });
  }
  render() {
    return [
      h("div", { class: "main" }, this.fileServerPath !== '' &&
        h("ion-fab", { slot: "fixed", vertical: "bottom", horizontal: "end" }, h("ion-fab-button", { id: "showMenu", onClick: e => this.toggleMenu(e), color: "light" }, h("ion-icon", { src: this.menuOpen === true ? `${this.fileServerPath}/ionicons/close.svg` : `${this.fileServerPath}/ionicons/briefcase.svg` }))), h("div", { id: "perspective", class: "perspective effect-rotateleft" }, h("div", { class: "container", onClick: e => this.menuOpen === true && this.toggleMenu(e) }, h("div", { id: "sceneWrapper", class: "wrapper" }, this.fileServerHasStarted === true &&
        [h("div", { class: "environment-navigation" }, this.mapEnvironments()), h("vr-scene", { fileServerPath: this.fileServerPath, activeEnvironment: this.activeEnvironment, userEnvironment: this.userEnvironment, showSplash: this.showSplash })
        ])), h("nav", { class: "outer-nav right vertical" }, h("div", null, this.seizableItemList.length > 0 ?
        h("ion-list", null, this.mapSeizableItems()) :
        h("div", { class: "no-items" }, "No seizable items for ", config.environments[this.activeEnvironment].name)))), h("div", { class: `splash ${this.showSplash === true ? 'splash--show' : ''}` }, h("img", { src: "../assets/images/splash.gif" })))
    ];
  }
  get el() { return getElement(this); }
};
VrMain.style = vrMainCss;

export { VrMain as vr_main };
