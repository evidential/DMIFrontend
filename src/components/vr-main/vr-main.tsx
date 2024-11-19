import {Component, State, h, Element, Listen} from '@stencil/core';
import {toastController} from "@ionic/core";
import {config} from "../../config";
import {debounce} from "../../assets/scripts/utils";
import { cloneDeep } from 'lodash';
import { io } from '../../assets/scripts/libraries/socketio-4.7.5.js';

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
  socket = null;

  @Element() el: HTMLElement;

  @State() reviewEnabled: boolean = false;
  @State() menuOpen: boolean = false;
  @State() showSplash: boolean = true;
  @State() activeEnvironment: number = 0;
  @State() userEnvironment: number = 0;
  @State() seizableItemList: any[] = [];
  @State() environmentLoaded: boolean = false;

  @Listen('environmentLoaded')
  async environmentLoadedHandler() {
    this.environmentLoaded = true;
  }

  @Listen('itemSeized')
  async markerAddedHandler(event) {
    await this.itemSeized(event.detail);
  }

  async componentWillLoad() {
    this.seizableItemList = cloneDeep(config.seizableItems);
    this.setupSocket();
  }

  async componentDidLoad() {
    this.startSplashTimer();
  }

  setupSocket() {
    this.socket = io(config.socketServerURL, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    this.socket.on('teleported to area', debounce(async areaData => {
      if (this.activeEnvironment !== areaData.AreaIndex) {
        await this.presentToast(`User has moved to ${config.environments[areaData.AreaIndex].name}`);
      }
      this.activeEnvironment = areaData.AreaIndex;
      this.userEnvironment = areaData.AreaIndex;
    }, 500, true));

    this.socket.on('reset for new user', debounce(async () => {
      this.activeEnvironment = 0;
      this.userEnvironment = 0;
      this.seizableItemList = cloneDeep(config.seizableItems);
      const vrScene = this.el.querySelector('vr-scene');
      if (vrScene) vrScene.resetScene();
      await this.presentToast('New user session in progress');
    }, 500, true));
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

  async toggleReview() {
    this.reviewEnabled = !this.reviewEnabled;

    if (this.reviewEnabled === true) {
      console.log('Review enabled');
    } else {
      console.log('Review disabled');
    }
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
          <img alt={props.item.name} src={`./assets/images/${props.item.image}`}/>
        </ion-thumbnail>
        <ion-label>
          <h3>{props.item.name}</h3>
          <p>{props.item.info}</p>
        </ion-label>
        {props.item.seized === true &&
            <ion-icon color="dark" src={`./assets/ionicons/briefcase.svg`} slot="end"></ion-icon>}
      </ion-item>
  );

  render() {
    return [
      <div class="main">
        <ion-fab slot="fixed" vertical="bottom" horizontal="end"
                 hidden={!this.reviewEnabled}>
          <ion-fab-button id="showMenu" onClick={e => this.toggleMenu(e)} color="light">
            <ion-icon src={this.menuOpen === true ? `./assets/ionicons/close.svg` : `./assets/ionicons/briefcase.svg`}></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <div id="perspective" class="perspective effect-rotateleft">
          <div class="container" onClick={e => this.menuOpen === true && this.toggleMenu(e)}>
            <div id="sceneWrapper" class="wrapper">
              <div class="environment-navigation"
                   hidden={!this.reviewEnabled}>
                {this.mapEnvironments()}
              </div>
              <vr-scene activeEnvironment={this.activeEnvironment}
                        userEnvironment={this.userEnvironment}
                        showSplash={this.showSplash}
                        reviewEnabled={this.reviewEnabled}
                        socket={this.socket}/>

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

          <ion-button class={`review-toggle-button ${this.reviewEnabled === true ? 'review-toggle-button--enabled' : 'review-toggle-button--disabled'}`}
                      onClick={() => this.toggleReview()}
                      color={this.reviewEnabled === true ? 'primary' : 'light'}
                      hidden={!this.environmentLoaded}>
            {this.reviewEnabled === true ? 'Disable' : 'Enable'} Review Mode
            <ion-icon name={this.reviewEnabled === true ? 'stats-chart' : 'stats-chart-outline'}
                      slot="end"
                      aria-hidden="true" />
          </ion-button>

        </div>

        <div class={`splash ${this.showSplash === true ? 'splash--show' : ''}`}>
          <img src="../assets/images/splash.gif"/>
        </div>

      </div>
    ];
  }
}
