import {Component, State, h, Element, Prop, Watch, Event, EventEmitter, Method} from '@stencil/core';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {config} from "../../config";
import {debounce, replaceSpacesWithUnderscores} from "../../assets/scripts/utils";
import { cloneDeep } from 'lodash';

declare const AFRAME;
declare const THREE;
declare const ldBar;

@Component({
  tag: 'vr-scene',
  styleUrl: 'vr-scene.css'
})
export class VrScene {

  scene: any;
  camera: any;
  renderer: any;
  controls: any;
  loadingBars: any[] = [];
  showItemOverlay: boolean = false;
  viewingItem: boolean = false;
  itemAnimationDuration: number = 1500;
  backToSceneTimeout: any;
  backButtonTimeout: any;

  @Element() el: HTMLElement;

  @State() sceneReady: boolean = false;
  @State() activeItemState: string = '';
  @State() activeItemName: string = '';
  @State() activeItemInfo: string = '';
  @State() activeItemImage: string = '';
  @State() cameraPosition: string = '';
  @State() cameraRotation: string = '';
  @State() interactableItemList: any[] = [];
  @State() environmentInteractableItemList: any[] = [];
  @State() filteredItemList: any[] = [];
  @State() segmentSelectedName: string = 'interactive';

  @Prop() showSplash: boolean = true;
  @Prop() activeEnvironment: number;
  @Prop() userEnvironment: number;
  @Prop() socket: any;
  @Prop() reviewEnabled: boolean;
  @Prop() activeCollarID: number;

  @Event() environmentLoaded: EventEmitter;
  @Event() itemInteractedWith: EventEmitter;
  @Event() teleportedEnvironment: EventEmitter;

  @Watch('showSplash')
  async showSplashHandler() {
    console.log('HIDE SPLASH IN VR SCENE');
    this.initialiseLoadingBars();

    setTimeout(() => {
      console.log('LOAD SCENE MODEL');
      this.loadSceneEnvironments();
    }, 1200);
  }

  @Watch('activeEnvironment')
  async activeEnvironmentHandler() {
    this.changeEnvironment(this.activeEnvironment);
  }

  @Watch('reviewEnabled')
  async reviewEnabledHandler() {
    if (this.reviewEnabled === true) {
      this.changeItemList('seized');
    } else {
      this.changeItemList('interactive');
    }
    this.backToScene(true);
  }

  async componentWillLoad() {
    this.interactableItemList = cloneDeep(config.interactableItems);
    this.updateEnvironmentItems(0);
  }

  async componentDidLoad() {
    this.initialiseAFrameComponents();
    this.changeItemList(this.segmentSelectedName);

    this.socket.on('item updated', debounce(itemData => {
      setTimeout(() => {
        if (itemData.IsSeized || itemData.IsTriaged || itemData.IsIgnored) {
          this.viewItem(itemData, true);
        } else {
          this.resetItem(itemData);
        }
      }, 100);
    }, 200, true));
  }

  @Method()
  async resetScene() {
    const activeItem = this.el.querySelector('.active-item');
    const interactableItemList = this.el.querySelector('.interactable-item-list');
    this.interactableItemList = cloneDeep(config.interactableItems);
    this.segmentSelectedName = 'interactive';
    this.updateEnvironmentItems(0);

    if (this.viewingItem === true) {
      this.viewingItem = false;
      activeItem.classList.toggle('flipped');
      interactableItemList.classList.toggle('flipped');
      this.toggleItemOverlay();
    }

    this.setCamera(this.activeEnvironment);
  }

  changeEnvironment(environmentIndex: number) {
    clearTimeout(this.backToSceneTimeout);
    clearTimeout(this.backButtonTimeout);
    this.backToScene(false);
    this.setCamera(environmentIndex);
    this.updateEnvironmentItems(environmentIndex);
  }

  updateEnvironmentItems(environmentIndex: number) {
    const interactableItemsIds = config.environments.find(environment => environment.id === environmentIndex).interactableItems;
    this.environmentInteractableItemList = this.interactableItemList.filter(item => interactableItemsIds.includes(item.ItemNumber));
    this.changeItemList(this.segmentSelectedName);
  }

  setCamera(environmentIndex: number) {
    const camera: any = this.el.querySelector('#camera');
    const animationRig: any = this.el.querySelector('#animationRig');
    const animationCamera: any = this.el.querySelector('#animationCamera');
    const cameraPosition = config.environments[environmentIndex].cameraPosition;
    const cameraRotation = config.environments[environmentIndex].cameraRotation;
    this.cameraPosition = `${cameraPosition.x} ${cameraPosition.y} ${cameraPosition.z}`;
    const touchLookControls = camera.components['touch-look-controls'];

    camera.setAttribute('touch-look-controls', {enabled: false});
    touchLookControls.pitchObject.rotation.x = THREE.MathUtils.degToRad(cameraRotation.x);
    touchLookControls.yawObject.rotation.y = THREE.MathUtils.degToRad(cameraRotation.y);
    camera.setAttribute('touch-look-controls', {enabled: true});

    // Reset animation camera if mid-animation
    animationRig.setAttribute('animation__pos', `property: position; easing: easeInOutQuad; dur: 0; to: ${cameraPosition.x} ${cameraPosition.y} ${cameraPosition.z}`);
    animationCamera.setAttribute('animation__rot', `property: rotation; easing: easeInOutQuad; dur: 0; to: ${cameraRotation.x} ${cameraRotation.y} ${cameraRotation.z}`);

    camera.setAttribute('camera', 'active', true);
    animationCamera.setAttribute('camera', 'active', false);
  }

  initialiseAFrameComponents() {
    const self = this;

    AFRAME.registerComponent('scene-ready', {
      init: function() {
        const sceneEl = this.el;

        self.scene = sceneEl.object3D;
        console.log('AFRAME SCENE SET');
        self.camera = sceneEl.camera;
        self.renderer = sceneEl.renderer;

        self.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        self.renderer.toneMappingExposure = 1.1;
        self.renderer.outputEncoding = THREE.sRGBEncoding;
        self.renderer.physicallyCorrectLights = true;

        self.sceneReady = true;

        setTimeout(() => self.setCamera(self.activeEnvironment), 2000);
      }
    });
  }

  initialiseLoadingBars() {
    this.loadingBars.push(new ldBar('#ldBar1'));
  }

  loadSceneEnvironments() {
    const aFrameSceneEl = this.el.querySelector('.aframe-scene');
    const environmentLoadingEl = this.el.querySelector('.environment-loading');
    const initialisingEl = this.el.querySelector('.initialising-hidden');
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`./assets/scripts/libraries/draco/gltf/`);

    loader.setDRACOLoader(dracoLoader);

    const promises: Promise<void>[] = config.environments.map(environment => {
      return new Promise<void>((resolve, reject) => {
        if (environment.model === '') {
          resolve();
          return;
        }

        loader.load(
            `${config.s3Bucket}${config.envirinmentModel}`,
            gltf => {
              gltf.scene.userData = {
                environmentId: environment.id
              };
              this.scene.add(gltf.scene);
              initialisingEl.classList.remove('initialising-hidden');
              resolve();
            },
            xhr => {
              this.loadingBars[0].set(Math.ceil(xhr.loaded / xhr.total * 100));
            },
            error => {
              reject(error);
            }
        );
      });
    });

    Promise.all(promises)
        .then(() => {
          // All resources have been loaded
          console.log('All resources loaded');
          setTimeout(() => {
            const scene: HTMLElement = document.querySelector('a-scene');
            environmentLoadingEl.classList.add('environment-loading--loaded');
            aFrameSceneEl.classList.remove('aframe-scene--loading');
            scene.offsetHeight;
            this.environmentLoaded.emit();
          }, 2000);
        })
        .catch(error => {
          // Error occurred while loading resources
          console.error('Error loading resources:', error);
        });
  }

  toggleItemOverlay() {
    const itemOverlay = this.el.querySelector('#itemOverlay');
    this.showItemOverlay = !this.showItemOverlay;

    if (this.showItemOverlay === true) {
      itemOverlay.classList.remove('item-overlay--hidden');
    } else if (this.showItemOverlay === false) {
      itemOverlay.classList.add('item-overlay--hidden');
    }
  }

  moveCameraToItem(item, cameraOverrides) {
    const animationRig: any = this.el.querySelector('#animationRig');
    const camera: any = this.el.querySelector('#camera');
    const animationCamera: any = this.el.querySelector('#animationCamera');
    const backButton = this.el.querySelector('#backButton');
    const cameraRotation = camera.object3D.rotation;

    animationCamera.setAttribute('rotation', {
      x: THREE.MathUtils.radToDeg(cameraRotation.x),
      y: THREE.MathUtils.radToDeg(cameraRotation.y),
      z: 0
    });

    camera.setAttribute('camera', 'active', false);
    animationCamera.setAttribute('camera', 'active', true);

    let itemTarget = this.getItemPosition(animationCamera, item);

    backButton.setAttribute('disabled', 'true');

    // If animating back to scene, cancel that as now heading to a new marker
    clearTimeout(this.backToSceneTimeout);
    clearTimeout(this.backButtonTimeout);

    this.backButtonTimeout = setTimeout(() => backButton.setAttribute('disabled', 'false'), this.itemAnimationDuration);

    this.lookAt(camera, animationCamera, itemTarget);
    this.dollyTo(animationRig, item, cameraOverrides);
  }

  getItemPosition(animationCamera, targetObject) {
    const entityPosition = new THREE.Vector3();
    targetObject.getWorldPosition(entityPosition);

    const cameraPosition = new THREE.Vector3();
    animationCamera.object3D.getWorldPosition(cameraPosition);

    const vector = new THREE.Vector3(
        entityPosition.x,
        entityPosition.y,
        entityPosition.z
    );
    vector.subVectors(cameraPosition, vector).add(cameraPosition);
    return vector;
  }

  dollyTo(animationRig, target, cameraOverrides) {
    let depthScalar = -0.3;
    let upScalar = -0.1;
    if (cameraOverrides !== null) {
      depthScalar = cameraOverrides.depth;
      upScalar = cameraOverrides.up;
    }

    // Calculate the direction vector from the animation camera to the target
    const direction = new THREE.Vector3();
    target.getWorldPosition(direction);
    direction.sub(animationRig.object3D.getWorldPosition(new THREE.Vector3()));

    // Calculate the up vector
    const up = new THREE.Vector3(0, 0, 1); // Adjust the axis as needed
    up.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2); // Rotate the axis by 90 degrees around the x-axis

    // Calculate the destination position for the camera
    const destination = new THREE.Vector3();
    destination.copy(target.getWorldPosition(new THREE.Vector3()));
    destination.add(direction.normalize().multiplyScalar(depthScalar));
    destination.add(up.multiplyScalar(upScalar));

    animationRig.setAttribute('animation__pos', `property: position; easing: easeInOutQuad; dur: ${this.itemAnimationDuration}; to: ${destination.x} ${destination.y} ${destination.z}`);
  }

  dollyBack(animationRig, target) {
    // Calculate the direction vector from the animation camera to the target
    const direction = new THREE.Vector3();
    target.object3D.getWorldPosition(direction);
    direction.sub(animationRig.object3D.getWorldPosition(new THREE.Vector3()));

    // Calculate the destination position for the camera
    const destination = new THREE.Vector3();
    destination.copy(target.object3D.getWorldPosition(new THREE.Vector3()));

    animationRig.setAttribute('animation__pos', `property: position; easing: easeInOutQuad; dur: ${this.itemAnimationDuration}; to: ${destination.x} ${destination.y} ${destination.z}`);
  }

  lookAt(camera, animationCamera, vector) {
    const initialRotation = Object.assign({}, animationCamera.getAttribute('rotation'));
    animationCamera.object3D.lookAt(vector);
    const targetRotation = animationCamera.getAttribute('rotation');

    // Calculate the difference in rotation angles for y-axis
    let deltaY = targetRotation.y - initialRotation.y;

    // Adjust the difference to ensure it takes the shortest path
    if (deltaY > 180) {
      deltaY -= 360;
    } else if (deltaY < -180) {
      deltaY += 360;
    }

    // Apply the adjusted rotation to the initial rotation
    animationCamera.setAttribute('rotation', initialRotation);
    camera.setAttribute('rotation', initialRotation);

    // Animate the rotation to the adjusted target rotation
    animationCamera.setAttribute('animation__rot', `property: rotation; easing: easeInOutQuad; dur: ${this.itemAnimationDuration}; to: ${targetRotation.x} ${initialRotation.y + deltaY} 0`);
  }

  viewItem(interactiveItem, itemInteractedWith) {
    const interactableItem = this.interactableItemList.find(item => item.ItemNumber === interactiveItem.ItemNumber);
    const glbMeshID = interactableItem.glbID;
    const itemName =interactableItem.name;
    const itemInfo = interactableItem.info;
    const cameraOverrides = interactableItem.cameraOverrides;
    const activeItem = this.el.querySelector('.active-item');
    const interactableItemList = this.el.querySelector('.interactable-item-list');
    const itemMesh = this.scene.getObjectByName(replaceSpacesWithUnderscores(glbMeshID));

    this.activeItemState = this.getitemState(interactableItem);

    this.activeItemName = itemName;
    this.activeItemInfo = itemInfo;
    this.activeItemImage =interactableItem.image;

    if (this.reviewEnabled === false) {
      if (this.userEnvironment !== this.activeEnvironment) {
        this.activeEnvironment = this.userEnvironment;
        this.changeEnvironment(this.activeEnvironment);
      }
    }

    if (itemInteractedWith === true) {
      interactableItem.IsIgnored = interactiveItem.IsIgnored;
      interactableItem.IsSeized = interactiveItem.IsSeized;
      interactableItem.IsTriaged = interactiveItem.IsTriaged;
      this.activeItemState = this.getitemState(interactableItem);

      this.changeItemList(this.segmentSelectedName);

      this.highlightInteractedItem(itemMesh, true);

      this.itemInteractedWith.emit({
        interactedWithItem: interactableItem,
        message: `${itemName} ${ this.getitemState(interactableItem)} from ${config.environments[this.userEnvironment].name}`
      });
    }

    if (this.reviewEnabled === false || itemInteractedWith === false) {
      setTimeout(() => {
        this.moveCameraToItem(itemMesh, cameraOverrides);

        if (this.viewingItem === false) {
          this.viewingItem = !this.viewingItem;

          activeItem.classList.toggle('flipped');
          interactableItemList.classList.toggle('flipped');

          this.toggleItemOverlay();
        }
      }, 100);
    }
  }

  resetItem(interactiveItem) {
    const interactableItem = this.interactableItemList.find(item => item.ItemNumber === interactiveItem.ItemNumber);
    const glbMeshID = interactableItem.glbID;
    const itemMesh = this.scene.getObjectByName(replaceSpacesWithUnderscores(glbMeshID));

    interactableItem.IsSeized = false;
    interactableItem.IsTriaged = false;
    interactableItem.IsIgnored = false;

    this.highlightInteractedItem(itemMesh, false);

    this.activeItemState = this.getitemState(interactableItem);
    this.changeItemList(this.segmentSelectedName);

    this.itemInteractedWith.emit({
      interactedWithItem: interactableItem,
      message: ''
    });
  }

  getitemState(item) {
    return ['IsSeized', 'IsTriaged', 'IsIgnored'].find(key => {
      return item[key];
    })?.replace('Is', '').toLowerCase() || '';
  }

  highlightInteractedItem(itemEntity, interacted) {
    console.log(itemEntity, interacted);
  }

  backToScene(animate: boolean) {
    if (this.viewingItem === false) return;

    const activeItem = this.el.querySelector('.active-item');
    const interactableItemList = this.el.querySelector('.interactable-item-list');
    const animationRig: any = this.el.querySelector('#animationRig');
    const rig: any = this.el.querySelector('#rig');
    const camera: any = this.el.querySelector('#camera');
    const animationCamera: any = this.el.querySelector('#animationCamera');
    const markerItems = this.el.querySelectorAll('.marker-item');
    let targetRotation = camera.getAttribute('rotation');
    let duration = 0;

    if (animate === true) duration = this.itemAnimationDuration;

    markerItems.forEach(markerItem => markerItem.setAttribute('disabled', 'true'));

    this.dollyBack(animationRig, rig);
    animationCamera.setAttribute('animation__rot', `property: rotation; easing: easeInOutQuad; dur: ${duration}; to: ${targetRotation.x} ${targetRotation.y} 0`);

    if (animate === true) {
      this.backToSceneTimeout = setTimeout(() => {
        camera.setAttribute('camera', 'active', true);
        animationCamera.setAttribute('camera', 'active', false);
        markerItems.forEach(markerItem => markerItem.setAttribute('disabled', 'false'));
      }, duration + 100);
    } else {
      camera.setAttribute('camera', 'active', true);
      animationCamera.setAttribute('camera', 'active', false);
      markerItems.forEach(markerItem => markerItem.setAttribute('disabled', 'false'));
    }

    this.viewingItem = !this.viewingItem;
    this.toggleItemOverlay();

    activeItem.classList.toggle('flipped');
    interactableItemList.classList.toggle('flipped');
  }

  changeItemList(value) {
    let itemList;
    switch(value) {
      case 'interactive':
        this.segmentSelectedName = 'interactive';
        itemList = [...this.environmentInteractableItemList];
        break;
      case 'seized':
        this.segmentSelectedName = 'seized';
        itemList = this.environmentInteractableItemList.filter(item => {
          return item.IsSeized === true;
        });
        break;
      case 'triaged':
        this.segmentSelectedName = 'triaged';
        itemList = this.environmentInteractableItemList.filter(item => {
          return item.IsTriaged === true;
        });
        break;
      case 'ignored':
        this.segmentSelectedName = 'ignored';
        itemList = this.environmentInteractableItemList.filter(item => {
          return item.IsIgnored === true;
        });
        break;
      default:
        itemList = this.environmentInteractableItemList.filter(item => {
          return item.IsSeized === true;
        });
    }

    this.filteredItemList = this.mapInteractableItems(itemList);
  }

  mapInteractableItems(itemList) {
    return itemList.map(item => {
      return <this.InteractableListItem item={item} />;
    });
  }

  InteractableListItem = (props: { item }) => (
      <ion-item class={`interactable-item ${props.item.IsIgnored === true && 'ignored'} ${props.item.IsSeized === true && 'seized'} ${props.item.IsTriaged === true && 'triaged'}`} button onClick={() => this.viewItem(props.item, false)} lines="full">
        <ion-thumbnail>
          <img alt={props.item.name} src={`./assets/images/${props.item.image}`}  />
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
    return [
      <div class="scene-container">

        <div class="environment-loading">
          <div class="environment-loading-message">Loading House</div>
          <div id="ldBar1" class="ldBar"></div>
          <div class="initialising-message initialising-hidden">
            <div>Initialising App</div>
            <ion-spinner name="dots"></ion-spinner>
          </div>
        </div>

        <div id="itemOverlay" class="item-overlay item-overlay--hidden"
             hidden={this.reviewEnabled}></div>

        <div class={`interactable-item-card active-item ${this.activeItemState}`}>
          <ion-card color="light">
            <ion-label class="environment-name">{`${config.environments[this.activeEnvironment].name}`}</ion-label>
            <img src={`./assets/images/${config.environments[this.activeEnvironment].image}`}/>
            <ion-card-content>
              <img class="active-item-image" src={`./assets/images/${this.activeItemImage}`} />
              <h3>{this.activeItemName}</h3>
              <p>{this.activeItemInfo}</p>
            </ion-card-content>
            <ion-button id="backButton" onClick={() => this.backToScene(true)} expand="full" color="dark">Back
              <ion-icon src={`./assets/ionicons/caret-back.svg`} slot="start"/>
            </ion-button>
          </ion-card>
        </div>

        <div class="interactable-item-card interactable-item-list" hidden={!this.activeCollarID}>
          <ion-card color="light">
            <ion-label class="environment-name">{`${config.environments[this.activeEnvironment].name}`}</ion-label>
            <img src={`./assets/images/${config.environments[this.activeEnvironment].image}`}/>
            <ion-segment class="list-segment" value={this.segmentSelectedName}
                         onIonChange={e => this.changeItemList(e.detail.value)}
                         hidden={!this.reviewEnabled}
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
              <ion-segment-button value="interactive">
                <ion-label>All</ion-label>
              </ion-segment-button>
            </ion-segment>
            <div class="card-content">
              {this.filteredItemList.length > 0 ?
                  <ion-list>
                    {this.filteredItemList}
                  </ion-list> :
                  <div class="no-items">No {this.segmentSelectedName} items for {config.environments[this.activeEnvironment].name}</div>}
            </div>
          </ion-card>
        </div>

        <a-scene id="scene" class="aframe-scene aframe-scene--loading" scene-ready>
          <a-assets>
            <a-asset-item id="sceneModel" src={`${config.s3Bucket}${config.envirinmentModel}`}></a-asset-item>
            <img id="sky" src={`./assets/images/skybox-night.png`}/>
          </a-assets>

          <a-entity light="type: ambient; color: #BBB; intensity: 0.7;"></a-entity>
          <a-entity light="type: directional; color: #fff; intensity: 1.0" position="-56 35 -1"></a-entity>

          <a-sky class="skybox" src="#sky"></a-sky>
          <a-entity id="rig" position={this.cameraPosition} rotation="0 5 0">
            <a-entity id="camera" camera="active: true;" position="0 0 0" touch-look-controls></a-entity>
          </a-entity>

          <a-entity id="animationRig" position={this.cameraPosition} rotation="0 5 0">
            <a-entity id="animationCamera" camera="active: false;" position="0 0 0"></a-entity>
          </a-entity>
        </a-scene>
      </div>
    ];
  }
}
