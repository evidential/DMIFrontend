import {Component, State, h, Element, Listen} from '@stencil/core';
import {alertController, toastController} from "@ionic/core";
import {config} from "../../config";
import {debounce} from "../../assets/scripts/utils";
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
  activeSessions: any[] = [];

  @Element() el: HTMLElement;

  @State() reviewEnabled: boolean = false;
  @State() menuOpen: boolean = false;
  @State() showSplash: boolean = true;
  @State() activeCollarID: number;
  @State() activeEnvironment: number = 0;
  @State() userEnvironment: number = 0;
  @State() interactableItemList: any[] = [];
  @State() filteredItemList: any[] = [];
  @State() environments: any[] = [];
  @State() observingSession: boolean = false;
  @State() environmentLoaded: boolean = false;
  @State() segmentSelectedName: string = 'seized';
  @State() viewMode: string = 'live';

  @Listen('environmentLoaded')
  async environmentLoadedHandler() {
    this.environmentLoaded = true;

    if (this.activeSessions.length > 0 && !this.activeCollarID) {
      await this.viewLiveSessions();
    }
  }

  @Listen('itemInteractedWith')
  async itemInteractedWithHandler(event) {
    await this.itemInteractedWith(event.detail);
  }

  async componentWillLoad() {
    this.setupSocket();
  }

  async componentDidLoad() {
    this.socket.emit('get environment data');
    this.socket.emit('get active sessions');
    this.changeItemList(this.segmentSelectedName);
    this.startSplashTimer();
  }

  setupSocket() {
    this.socket = io(config.socketServerURL, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    this.socket.on('environment data retrieved', debounce(async data => {
      this.environments = [...data.environments];
      this.interactableItemList = data.interactableItems;
    }, 500, true));

    this.socket.on('active sessions retrieved', debounce(async activeSessions => {
      this.activeSessions = activeSessions;
    }, 500, true));

    this.socket.on('session started', debounce(async sessionData => {
      await this.sessionStarted(sessionData);
    }, 500, true));

    this.socket.on('session ended', debounce(async activeSessions => {
      await this.sessionEnded(activeSessions);
    }, 500, true));

    this.socket.on('teleported to area', debounce(async areaData => {
      if (this.reviewEnabled === false) {
        if (this.activeCollarID === areaData.collarID && this.activeEnvironment !== areaData.AreaIndex) {
          await this.presentToast(`User has moved to ${this.environments[areaData.AreaIndex].name}`);
          this.activeEnvironment = areaData.AreaIndex;
        }
      }

      const sessionData = this.activeSessions.find(session => session.ClientId === areaData.ClientId);
      if (sessionData) sessionData.AreaIndex = this.userEnvironment = areaData.AreaIndex;
    }, 500, true));

    this.socket.on('reset for new user', debounce(async () => {
      await this.resetVRConfirmed();
    }, 500, true));
  }

  async sessionStarted(sessionData) {
    this.activeSessions = [...this.activeSessions, sessionData];

    if (this.activeSessions.length <= 1) {
      await this.switchToSession(sessionData);
      await this.presentToast(`Observing user session for Collar ID: ${sessionData.collarID}.`);
    } else {
      const alert = await alertController.create({
        header: `User session started.`,
        message: `Do you want to observe the user session for Collar ID: ${sessionData.collarID} ?`,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'dark'
          },
          {
            cssClass: 'dark',
            text: 'Yes',
            handler: async () => await this.switchToSession(sessionData)
          }
        ]
      });
      await alert.present();
    }
  }

  async sessionEnded(activeSessions) {
    await this.presentToast(`VR session for collar ID: ${this.activeCollarID} ended`);
    this.activeCollarID = undefined;
    this.activeSessions = activeSessions;
    this.activeEnvironment = 0;
    this.userEnvironment = 0;
    this.observingSession = false;
    this.resetSegment();
    this.changeItemList('seized');
    const vrScene = this.el.querySelector('vr-scene');
    if (vrScene) vrScene.resetScene();

    if (this.activeSessions.length > 0) {
      await this.viewLiveSessions();
    }
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

  resetSegment() {
    const segment = this.el.querySelector('ion-segment');
    if (segment) {
      segment.value = 'seized';
    }
  }

  toggleMenu(e = null) {
    const perspectiveWrapper: HTMLElement = document.getElementById('perspective');

    if (this.menuOpen === false) {
      if (e === null) return;
      this.menuOpen = true;
      e?.stopPropagation();
      if (e?.cancelable) e?.preventDefault();
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
      position: 'top'
    });

    await this.toast.present();
  }

  async itemInteractedWith(detail) {
    const interactedWithItem = this.interactableItemList.find(item => item.ItemNumber === detail.interactedWithItem.ItemNumber);
    interactedWithItem.IsIgnored = detail.interactedWithItem.IsIgnored;
    interactedWithItem.IsSeized = detail.interactedWithItem.IsSeized;
    interactedWithItem.IsTriaged = detail.interactedWithItem.IsTriaged;
    const message = detail.message;

    this.interactableItemList = [...this.interactableItemList];
    this.changeItemList(this.segmentSelectedName);

    if (this.reviewEnabled === false && message) {
      await this.presentToast(message);
    }
  }

  async setActiveEnvironment(id, showToast = true) {
    this.activeEnvironment = id;
    if (showToast) await this.presentToast(`User moved to ${this.environments[this.activeEnvironment].name}`);
  }

  async switchToSession(sessionData) {
    this.observingSession = true;
    this.activeCollarID = sessionData.collarID;
    this.activeEnvironment = sessionData.AreaIndex;
    this.interactableItemList = sessionData.interactableItemList;
  }

  async toggleReview() {
    this.reviewEnabled = !this.reviewEnabled;

    if (this.reviewEnabled === false) {
      this.toggleMenu();
      this.activeEnvironment = this.userEnvironment;
    }
  }

  changeItemList(value) {
    let itemList;

    switch(value) {
      case 'all':
        this.segmentSelectedName = 'all';
        itemList = [...this.interactableItemList];
        break;
      case 'seized':
        this.segmentSelectedName = 'seized';
        itemList = this.interactableItemList.filter(item => {
          return item.IsSeized === true;
        });
        break;
      case 'triaged':
        this.segmentSelectedName = 'triaged';
        itemList = this.interactableItemList.filter(item => {
          return item.IsTriaged === true;
        });
        break;
      case 'ignored':
        this.segmentSelectedName = 'ignored';
        itemList = this.interactableItemList.filter(item => {
          return item.IsIgnored === true;
        });
        break;
      default:
        itemList = this.interactableItemList.filter(item => {
          return item.IsSeized === true;
        });
    }

    this.filteredItemList = this.mapInteractableItems(itemList);
  }

  async showResetVRAlert() {
    const alert = await alertController.create({
      header: `Reset scenario and save for review?`,
      message: `Are you sure you want to save the session and restart the scenario for collar ID: ${this.activeCollarID} in the VR headset?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'dark'
        },
        {
          cssClass: 'dark',
          text: 'OK',
          handler: () => this.resetVRConfirmed()
        }
      ]
    });

    await alert.present();
  }

  async resetVRConfirmed() {
    const activeSession = this.activeSessions.find(session => session.collarID === this.activeCollarID);
    this.socket.emit('reset vr', activeSession);
  }

  async resetVR() {
    await this.showResetVRAlert();
  }

  updateViewMode(viewMode) {
    this.viewMode = viewMode;
  }

  async viewLiveSessions() {
    // Check if an action sheet is already open
    const existingActionSheet = document.querySelector('ion-action-sheet');
    if (existingActionSheet) {
      await existingActionSheet.dismiss();
    }

    const actionSheet = document.createElement('ion-action-sheet');

    if (this.activeSessions.length < 1) {
      const alert = document.createElement('ion-alert');
      alert.header = 'No active sessions';
      alert.message = 'The VR manager app is currently not connected to any user sessions.';
      alert.buttons = ['OK'];

      document.body.appendChild(alert);
      return await alert.present();
    }

    actionSheet.header = 'Active sessions';
    actionSheet.buttons = [
      ...this.activeSessions.map(sessionData => ({
        text: `Collar ID: ${sessionData.collarID}`,
        cssClass: sessionData.collarID === this.activeCollarID ? 'active' : '',
        handler: () => {
          this.switchToSession(sessionData);
        }
      })),
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ];

    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  mapEnvironments() {
    if (this.environments.length < 1) return [];
    return this.environments.map(environment => {
      let activeEnvironment = '';
      if (environment.ItemNumber === this.activeEnvironment) activeEnvironment = 'environment-active';
      return <this.EnvironmentLink environment={environment} activeEnvironment={activeEnvironment}/>;
    });
  }

  EnvironmentLink = (props: { environment, activeEnvironment}) => (
      <div class="environment-container" onClick={() => this.setActiveEnvironment(props.environment.id, false)}>
        <div class="environment-link-name">{`${this.environments[props.environment.id].name}`}</div>
        <img class={props.activeEnvironment} src={`../assets/images/${this.environments[props.environment.id].image}`} />
      </div>
  );

  mapInteractableItems(itemList) {
    return itemList.map(item => {
      return <this.InteractableListItem item={item} />;
    });
  }

  InteractableListItem = (props: { item }) => (
      <ion-item class={`interactable-item ${props.item.IsIgnored === true && 'ignored'} ${props.item.IsSeized === true && 'seized'} ${props.item.IsTriaged === true && 'triaged'}`}
                lines="full">
        <ion-thumbnail>
          <img alt={props.item.name} src={`./assets/images/${props.item.image}`}/>
        </ion-thumbnail>
        <ion-label>
          <h3>{props.item.name}</h3>
          <p>{props.item.info}</p>
        </ion-label>
        {props.item.IsTriaged === true && <ion-icon color="dark" src={`./assets/ionicons/eye.svg`} slot="end"></ion-icon>}
        {props.item.IsSeized === true && <ion-icon color="dark" src={`./assets/ionicons/briefcase.svg`} slot="end"></ion-icon>}
        {props.item.IsIgnored === true && <ion-icon color="dark" src={`./assets/ionicons/eye-off.svg`} slot="end"></ion-icon>}
      </ion-item>
  );

  render() {
    console.log(this.activeSessions.length);
    return [
      <div class={`main ${this.reviewEnabled === true ? 'review-mode' : ''}`}>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end"
                 hidden={!this.reviewEnabled}>
          <ion-fab-button id="showMenu" onClick={e => this.toggleMenu(e)} color="light">
            <ion-icon src={this.menuOpen === true ? `./assets/ionicons/close.svg` : `./assets/ionicons/briefcase.svg`}></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <div id="perspective" class="perspective effect-rotateleft">
          <div class="container" onClick={e => this.menuOpen === true && this.toggleMenu(e)}>
            <div class="side-menu-wrapper">
              <div class="side-menu">
                <nav class="sidebar-group">
                  <ion-button class={this.viewMode === 'live' && 'active'}
                              title="View active session" fill="clear"
                              onClick={() => this.updateViewMode('live')}>
                    <ion-icon aria-hidden="true" name="videocam-outline"></ion-icon>
                  </ion-button>
                  <ion-button class={this.viewMode === 'review' && 'active'}
                              title="Review previous sessions" fill="clear"
                              onClick={() => this.updateViewMode('review')}>
                    <ion-icon aria-hidden="true" name="calendar-number-outline"></ion-icon>
                  </ion-button>
                </nav>

                <nav class="sidebar-sub-group" hidden={this.viewMode !== 'live'}>
                  <ion-button id="ViewLiveSessions"
                              class={this.viewMode === 'live' && 'active'}
                              title="View live sessions" fill="clear"
                              onClick={() => this.viewLiveSessions()}>
                    <ion-icon aria-hidden="true" name="people-outline"></ion-icon>
                  </ion-button>
                  <ion-button id="ViewLiveSessions"
                              title={`End VR session for Collar ID: ${this.activeCollarID}`}
                              fill="clear"
                              onClick={() => this.resetVR()}
                              hidden={!this.activeCollarID}>
                    <ion-icon aria-hidden="true" name="save-outline"></ion-icon>
                  </ion-button>
                </nav>
              </div>
            </div>

            <div class="review-sessions" hidden={this.viewMode === 'live'}>
              <div class="date-picker">
                Date
              </div>
            </div>

            <div id="sceneWrapper"
                 class={`wrapper ${this.observingSession === false ? 'wrapper--hidden' : ''}`}
                 hidden={this.viewMode === 'review'}>
              <div class="environment-navigation"
                   hidden={!this.reviewEnabled}>
                {this.mapEnvironments()}
              </div>
              <vr-scene activeEnvironment={this.activeEnvironment}
                        environments={this.environments}
                        interactableItemList={this.interactableItemList}
                        userEnvironment={this.userEnvironment}
                        showSplash={this.showSplash}
                        reviewEnabled={this.reviewEnabled}
                        activeCollarID={this.activeCollarID}
                        socket={this.socket}/>

            </div>
          </div>

          <nav class="outer-nav right vertical">
            <ion-segment class="list-segment" value="seized"
                         onIonChange={e => this.changeItemList(e.detail.value)}
                         mode="ios">
              <ion-segment-button value="seized">
                <ion-label>Seized</ion-label>
              </ion-segment-button>
              <ion-segment-button value="triaged">
                <ion-label>Triaged</ion-label>
              </ion-segment-button>
              <ion-segment-button value="ignored">
                <ion-label>Ignored</ion-label>
              </ion-segment-button>
              <ion-segment-button value="all">
                <ion-label>All</ion-label>
              </ion-segment-button>
            </ion-segment>
            <div>
              {this.filteredItemList.length > 0 ?
                  <ion-list>
                    {this.filteredItemList}
                  </ion-list> :
                  <div class="no-items">No {this.segmentSelectedName} items.</div>}
            </div>
          </nav>

          <div class="session-info-container" hidden={this.environmentLoaded === false}>
            <div class="session-info">
              {this.activeCollarID ? (
                  <div>
                    Observing collar ID: <span>{this.activeCollarID}</span>
                  </div>
              ) : (
                  <div>
                    {this.observingSession === false ? 'Not currently observing a VR Session.' : 'Waiting for a VR Session to commence..'}
                  </div>
              )}
            </div>
          </div>

          <ion-button class={`review-toggle-button ${this.reviewEnabled === true ? 'review-toggle-button--enabled' : 'review-toggle-button--disabled'}`}
                      onClick={() => this.toggleReview()}
                      color={this.reviewEnabled === true ? 'primary' : 'light'}
                      hidden>
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
