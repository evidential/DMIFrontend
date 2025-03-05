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
  collarIDSearch: string = '';
  activeSessions: any[] = [];
  debouncedSearchHandler: (event: any) => void;

  @Element() el: HTMLElement;

  @State() reviewEnabled: boolean = false;
  @State() menuOpen: boolean = false;
  @State() showSplash: boolean = true;
  @State() activeCollarID: string;
  @State() activeClientID: string;
  @State() activeEnvironment: number = 0;
  @State() userEnvironment: number = 0;
  @State() interactableItemList: any[] = [];
  @State() filteredItemList: any[] = [];
  @State() environments: any[] = [];
  @State() endedSessions: any[] = [];
  @State() observingSession: boolean = false;
  @State() environmentLoaded: boolean = false;
  @State() segmentSelectedName: string = 'all';
  @State() viewMode: string = 'live';
  @State() selectedDate: string | null = null;
  @State() noMatchingSessions: boolean = false;

  @Listen('environmentLoaded')
  async environmentLoadedHandler() {
    this.environmentLoaded = true;

    if (this.activeSessions.length > 0 && !this.activeCollarID) {
      await this.viewLiveSessions();
    }
  }

  @Listen('updateNonObservedSessionData')
  async updateNonObservedSessionDataHandler(event) {
    const itemData = event.detail.itemData;
    const item = event.detail.interactableItem;
    const sessionData = this.activeSessions.find(session => session.ClientId === itemData?.ClientId);

    if (sessionData) {
      sessionData.interactableItemList = sessionData.interactableItemList.map(interactableItem => {
        if (interactableItem.ItemNumber === item.ItemNumber) {
          return {
            ...interactableItem,
            IsIgnored: itemData.IsIgnored,
            IsSeized: itemData.IsSeized,
            IsTriaged: itemData.IsTriaged
          };
        }
        return interactableItem;
      });
    }
  }

  @Listen('itemInteractedWith')
  async itemInteractedWithHandler(event) {
    await this.itemInteractedWith(event.detail);
  }

  async componentWillLoad() {
    this.selectedDate = new Date().toISOString();
    this.debouncedSearchHandler = debounce(this.onSearchInput.bind(this), 500);
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

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected, attempting to reconnect...');
    });

    this.socket.on('connect', () => {
      console.log('Socket reconnected, requesting current sessions...');
      this.socket.emit('get active sessions');
    });

    this.socket.on('environment data retrieved', debounce(async data => {
      this.environments = [...data.environments];
      this.interactableItemList = data.interactableItems;
    }, 500, true));

    this.socket.on('active sessions retrieved', debounce(async activeSessions => {
      this.activeSessions = activeSessions;
    }, 500, true));

    this.socket.on('ended sessions retrieved', debounce(async endedSessions => {
      if (endedSessions.length > 0) {
        this.noMatchingSessions = false;
      } else {
        this.noMatchingSessions = true;
      }
      this.endedSessions = endedSessions;
    }, 500, true));

    this.socket.on('session started', debounce(async sessionData => {
      await this.sessionStarted(sessionData);
    }, 500, true));

    this.socket.on('session ended', debounce(async data => {
      await this.sessionEnded(data, true);
    }, 2000, true));

    this.socket.on('teleported to area', debounce(async areaData => {
      if (this.reviewEnabled === false) {
        if (this.activeCollarID === areaData.collarID && this.activeEnvironment !== areaData.AreaIndex && this.viewMode === 'live') {
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

    await this.presentToast(`User session started for Collar ID: ${sessionData.collarID}.`);

    if (this.viewMode === 'review' || this.reviewEnabled === true) return;

    if (this.activeSessions.length <= 1) {
      await this.switchToSession(sessionData, 'live');
    }
  }

  async sessionEnded(data, notify: boolean) {
    if (this.viewMode === 'review') return;

    const { activeSession, clientsInSession } = data;

    this.activeSessions = [...clientsInSession];

    if (notify) {
      await this.presentToast(`VR session for collar ID: ${activeSession.collarID} ended`);
    }

    if (activeSession.ClientId === this.activeClientID) {
      this.activeEnvironment = 0;
      this.userEnvironment = 0;
      this.observingSession = false;
      this.resetSegment();
      this.changeItemList('all');
      const vrScene = this.el.querySelector('vr-scene');
      if (vrScene) vrScene.resetScene();
      this.activeClientID = undefined;
      this.activeCollarID = undefined;
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
      segment.value = 'all';
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

  async switchToSession(sessionData, viewMode) {
    if (viewMode === 'live') {
      this.reviewEnabled = false;
    } else if (viewMode === 'review') {
      this.reviewEnabled = true;
    }
    this.observingSession = true;
    this.activeClientID = sessionData.ClientId;
    this.activeCollarID = sessionData.collarID;
    this.activeEnvironment = this.userEnvironment = this.reviewEnabled ? 0 : sessionData.AreaIndex;
    this.interactableItemList = sessionData.interactableItemList;
    this.filteredItemList = this.mapInteractableItems(this.interactableItemList);
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

  async showDeleteSessionAlert() {
    return new Promise((resolve) => {
      const alert = document.createElement('ion-alert');
      alert.header = 'Confirm Delete';
      alert.message = 'Are you sure you want to delete this session?';
      alert.buttons = [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => resolve(false),
        },
        {
          text: 'Delete',
          handler: () => resolve(true),
        }
      ];
      document.body.appendChild(alert);
      alert.present();
    });
  }

  async showResetVRAlert() {

    const existingAlert = document.querySelector('ion-alert');
    if (existingAlert) {
      await existingAlert.dismiss();
    }

    const alert = await alertController.create({
      header: `End session and save for review?`,
      message: `Are you sure you want to end and save the session for collar ID: ${this.activeCollarID} in the VR headset?`,
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
    this.socket.emit('end session', JSON.stringify(activeSession));
  }

  async resetVR() {
    await this.showResetVRAlert();
  }

  onSearchInput(e: any) {
    const value = e.target.value;
    this.collarIDSearch = value;

    this.endedSessions = [];
    this.socket.emit('get ended sessions', {
      collarID: this.collarIDSearch,
      date: this.selectedDate
    });
  }

  async updateSelectedDate(e: any) {
    const newDate = e.detail.value;
    const datePicker = this.el.querySelector('ion-datetime');

    // If the new date is the same as the current selected date, clear it
    if (this.selectedDate === newDate) {
      this.selectedDate = null;
      if (datePicker) {
        datePicker.reset();
        const focusedDate: HTMLButtonElement = datePicker.shadowRoot.querySelector(
            '.calendar-day-wrapper button:focus'
        );

        if (focusedDate) {
          focusedDate.blur();
        }
      }
    } else {
      this.selectedDate = newDate;
    }

    this.noMatchingSessions = false;
    this.endedSessions = [];
    this.socket.emit('get ended sessions', {
      collarID: this.collarIDSearch,
      date: this.selectedDate
    });
  }

  async updateViewMode(viewMode) {
    if (viewMode === this.viewMode) return;
    if (viewMode === 'live') {
      this.activeCollarID = this.activeClientID?.split('_')[1] || '';
      if (this.activeClientID) this.observingSession = true;
    } else if (viewMode === 'review') {
      this.socket.emit('get ended sessions', {
        collarID: this.collarIDSearch,
        date: this.selectedDate
      });
      this.observingSession = false;
      this.activeCollarID = '';
    }
    this.viewMode = viewMode;
  }

  async viewLiveSessions() {
    // Check if an action sheet is already open
    let actionSheet = document.querySelector('ion-action-sheet');

    if (this.activeSessions.length < 1) {
      const existingAlert = document.querySelector('ion-alert');
      if (existingAlert) {
        await existingAlert.dismiss();
      }

      const alert = document.createElement('ion-alert');
      alert.header = 'No active sessions';
      alert.message = 'The VR manager app is currently not connected to any user sessions.';
      alert.buttons = ['OK'];

      document.body.appendChild(alert);
      return await alert.present();
    }

    const buttons = [
      ...this.activeSessions.map(sessionData => ({
        text: `Collar ID: ${sessionData.collarID}`,
        cssClass: sessionData.collarID === this.activeCollarID ? 'active' : '',
        handler: async () => {
          await this.updateViewMode('live');
          await this.switchToSession(sessionData, 'live');
        }
      })),
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ];

    if (actionSheet) {
      // If action sheet exists, update its buttons
      actionSheet.buttons = buttons;
      await actionSheet.present();  // Re-present it with the updated buttons
    } else {
      // Otherwise, create a new action sheet
      actionSheet = document.createElement('ion-action-sheet');
      actionSheet.header = 'Active sessions';
      actionSheet.buttons = buttons;

      document.body.appendChild(actionSheet);
      await actionSheet.present();
    }
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);

    const datePart = date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const timePart = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${datePart} at ${timePart}`;
  }

  async setReviewSessionData(sessionData) {
    this.viewMode = 'live';
    this.reviewEnabled = true;
    await this.switchToSession(sessionData, 'review');
  }

  async deleteSession(sessionItem: any) {
    const confirm = await this.showDeleteSessionAlert();

    if (confirm) {
      this.endedSessions = [];
      this.socket.emit('delete ended session', {
        clientId: sessionItem.ClientId,
        collarID: this.collarIDSearch,
        date: this.selectedDate
      });
    }
  }

  mapEndedSessions() {
    return this.endedSessions
        .slice()
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .map(item => {
          return <this.ReviewableListItem item={item} />;
        });
  }

  mapEnvironments() {
    if (this.environments.length < 1) return [];
    return this.environments.map(environment => {
      let activeEnvironment = '';
      if (environment.id === this.activeEnvironment) activeEnvironment = 'environment-container--active';
      return <this.EnvironmentLink environment={environment} activeEnvironment={activeEnvironment}/>;
    });
  }

  EnvironmentLink = (props: { environment, activeEnvironment}) => (
      <div class={`environment-container ${props.activeEnvironment}`} onClick={() => this.setActiveEnvironment(props.environment.id, false)}>
        <div class="environment-link-name">{`${this.environments[props.environment.id].name}`}</div>
        <img src={`../assets/images/${this.environments[props.environment.id].image}`} />
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

  ReviewableListItem = (props: { item }) => (
      <ion-item onClick={async () => this.setReviewSessionData(props.item)} class={`${props.item.ClientId === this.activeClientID ? 'selected' : ''}`}>
        <ion-label>
          Collar ID: {props.item.collarID}
        </ion-label>
        {props.item.startedAt && (
            <ion-label class="started-at">
              {this.formatDate(props.item.startedAt)}
            </ion-label>
        )}
        <ion-button
            slot="end"
            fill="clear"
            color="danger"
            onClick={async (e) => {
              e.stopPropagation();
              await this.deleteSession(props.item);
            }}>
          <ion-icon name="trash"></ion-icon>
        </ion-button>
      </ion-item>
  );

  render() {
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
                  <ion-button class={this.viewMode === 'review' === true ? 'active' : ''}
                              title="Choose previous sessions for review" fill="clear"
                              onClick={() => this.updateViewMode('review')}>
                    <ion-icon aria-hidden="true" name="calendar-number-outline"></ion-icon>
                  </ion-button>
                  <ion-button class={this.viewMode === 'live' ? 'active' : ''}
                              title="View session" fill="clear"
                              onClick={() => this.updateViewMode('live')}>
                    <ion-icon aria-hidden="true" name="videocam-outline"></ion-icon>
                  </ion-button>
                </nav>

                <nav class="sidebar-sub-group">
                  <ion-button id="ViewLiveSessions"
                              class={this.viewMode === 'live' && 'active'}
                              title="Select live session" fill="clear"
                              onClick={() => this.viewLiveSessions()}>
                    <ion-icon aria-hidden="true" name="people-outline"></ion-icon>
                  </ion-button>
                  <ion-button id="ViewLiveSessions"
                              title={`End VR session for Collar ID: ${this.activeCollarID}`}
                              fill="clear"
                              onClick={() => this.resetVR()}
                              hidden={!this.activeCollarID || this.reviewEnabled === true}>
                    <ion-icon aria-hidden="true" name="save-outline"></ion-icon>
                  </ion-button>
                </nav>
              </div>
            </div>

            <div class="review-sessions" hidden={this.viewMode === 'live'}>
              <div class="review-search-container">
                <div class="collar-id-search">
                  <ion-searchbar placeholder="Enter Collar ID"
                                 value={this.collarIDSearch}
                                 onIonInput={this.debouncedSearchHandler} />
                </div>
                <div class="date-picker-and-results">
                  <ion-datetime
                      id="datetime"
                      color="primary"
                      value={this.selectedDate}
                      onIonChange={e => this.updateSelectedDate(e)}
                      presentation="date"
                  ></ion-datetime>
                  <div class="review-list">
                    <ion-list inset={true} lines="full" hidden={this.noMatchingSessions === true}>
                      {this.endedSessions.length > 0 ? this.mapEndedSessions() :
                          Array.from({ length: 8 }).map((_, index) => (
                              <ion-item key={index}>
                                <ion-skeleton-text animated={true} />
                              </ion-item>
                          ))
                      }
                    </ion-list>
                    <div class="no-matching-sessions" hidden={this.noMatchingSessions === false}>
                      No matching sessions. Please amend your search.
                    </div>
                  </div>
                </div>
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
            <ion-segment class="list-segment" value="all"
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

          <div class={`waiting-header ${this.observingSession === false && this.viewMode === 'live' ? 'waiting-header--show' : ''}`}>
            DMI VR App
          </div>

          <div class={`waiting-image-container ${this.observingSession === false && this.viewMode === 'live' ? 'waiting-image-container--show' : ''}`}>
            <img src="../assets/images/vr-headset.png" alt="VR Headset" class="waiting-image" />
          </div>

          <div class="session-info-container" hidden={this.viewMode === 'review' || this.showSplash === true}>
            <div class="session-info">
              {this.activeCollarID ? (
                  <div>
                    {this.reviewEnabled === true ? 'Reviewing' : 'Observing'} collar ID: <span>{this.activeCollarID}</span>
                  </div>
              ) : (
                  <div>
                    {this.observingSession === false ? 'Not currently observing a VR Session.' : 'Waiting for a VR Session to commence..'}
                  </div>
              )}
            </div>
          </div>

        </div>

        <div class={`splash ${this.showSplash === true ? 'splash--show' : ''}`}>
          <img src="../assets/images/splash.gif"/>
        </div>

      </div>
    ];
  }
}
