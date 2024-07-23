import {Component, State, h, Element, Listen} from '@stencil/core';
import {toastController} from "@ionic/core";
import {config} from "../../config";
import {debounce} from "../../assets/scripts/utils";
import { cloneDeep } from 'lodash';

declare const front;

@Component({
  tag: 'vr-main',
  styleUrl: 'vr-main.css'
})
export class VrMain {

  toast: HTMLIonToastElement;
  timer: any = null;
  interval: number  = 500;
  initialDelay: number = 7000;
  elapsedTime: number = 0;

  @Element() el: HTMLElement;

  @State() menuOpen: boolean = false;
  @State() showSplash: boolean = true;
  @State() fireSpeed: number = 0;
  @State() fireEnabled: boolean = false;
  @State() fileServerHasStarted: boolean = false;
  @State() fileServerPath: string = config.fileServerPath;
  @State() activeEnvironment: number = 0;
  @State() userEnvironment: number = 0;
  @State() seizableItemList: any[] = [];

  @Listen('itemSeized')
  async markerAddedHandler(event) {
    await this.itemSeized(event.detail);
  }

  async componentWillLoad() {
    this.seizableItemList = cloneDeep(config.seizableItems);

    front.on('file server started', fileServerPath => {
      this.fileServerHasStarted = true;
      this.fileServerPath = fileServerPath;
    });

    front.on('teleported to area', debounce(async areaData => {
      if (this.activeEnvironment !== areaData.AreaIndex) await this.presentToast(`User has moved to ${config.environments[areaData.AreaIndex].name}`);
      this.activeEnvironment = areaData.AreaIndex;
      this.userEnvironment = areaData.AreaIndex;
    }, 500, true));

    front.on('reset for new user', debounce(async () => {
      this.activeEnvironment = 0;
      this.userEnvironment = 0;
      this.seizableItemList = cloneDeep(config.seizableItems);
      const vrScene = this.el.querySelector('vr-scene');
      if (vrScene) vrScene.resetScene();
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
    const perspectiveWrapper: HTMLElement = document.getElementById('perspective');

    if (this.menuOpen === false) {
      this.menuOpen = true;
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
      perspectiveWrapper.classList.add('modalview');
      setTimeout( function() {
        perspectiveWrapper.classList.add('animate');
      }, 25 );
    } else if (this.menuOpen === true) {
      this.menuOpen = false;
      if (perspectiveWrapper.classList.contains('animate')) {
        const onEndTransFn = function (e) {
          if (e.target.class !== 'container' || e.propertyName.indexOf('transform') == -1) return;
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
    if (this.toast !== undefined) await this.toast.dismiss();

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
      if (environment.id === this.activeEnvironment) activeEnvironment = 'environment-active';
      return <this.EnvironmentLink environment={environment} activeEnvironment={activeEnvironment}/>;
    });
  }

  EnvironmentLink = (props: { environment, activeEnvironment}) => (
      <div class="environment-container" onClick={() => this.setActiveEnvironment(props.environment.id)}>
        <div class="environment-link-name">{`${config.environments[props.environment.id].name}`}</div>
        <img class={props.activeEnvironment} src={`../assets/images/${config.environments[props.environment.id].image}`} />
      </div>
  );

  mapSeizableItems() {
    return this.seizableItemList.map(item => {
      return <this.SeizableListItem item={item} />;
    });
  }

  SeizableListItem = (props: { item }) => (
      <ion-item class={`seizable-item ${props.item.seized === true && 'seized'}`}
                lines="full">
        <ion-thumbnail>
          <img alt={props.item.name} src={`${this.fileServerPath}/images/${props.item.image}`}/>
        </ion-thumbnail>
        <ion-label>
          <h3>{props.item.name}</h3>
          <p>{props.item.info}</p>
        </ion-label>
        {props.item.seized === true &&
            <ion-icon color="dark" src={`${this.fileServerPath}/ionicons/briefcase.svg`} slot="end"></ion-icon>}
      </ion-item>
  );

  render() {
    return [
      <div class="main">

        {this.fileServerPath !== '' &&
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
          <ion-fab-button id="showMenu" onClick={e => this.toggleMenu(e)} color="light">
            <ion-icon src={this.menuOpen === true ? `${this.fileServerPath}/ionicons/close.svg` : `${this.fileServerPath}/ionicons/briefcase.svg`}></ion-icon>
          </ion-fab-button>
        </ion-fab>}

        <div id="perspective" class="perspective effect-rotateleft">
          <div class="container" onClick={e => this.menuOpen === true && this.toggleMenu(e)}>
            <div id="sceneWrapper" class="wrapper">

              {this.fileServerHasStarted === true &&
              [<div class="environment-navigation">
                {this.mapEnvironments()}
              </div>,
              <vr-scene fileServerPath={this.fileServerPath}
                        activeEnvironment={this.activeEnvironment}
                        userEnvironment={this.userEnvironment}
                        showSplash={this.showSplash}/>
              ]}
            </div>
          </div>

          <nav class="outer-nav right vertical">
            <div>
            {this.seizableItemList.length > 0 ?
                <ion-list>
                  {this.mapSeizableItems()}
                </ion-list> :
                <div class="no-items">No seizable items for {config.environments[this.activeEnvironment].name}</div>}
            </div>
          </nav>
        </div>

        <div class={`splash ${this.showSplash === true ? 'splash--show' : ''}`}>
          <img src="../assets/images/splash.gif"/>
        </div>

      </div>
    ];
  }
}
