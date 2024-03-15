import { Component, h } from '@stencil/core';

@Component({
  tag: 'vr-root',
  styleUrl: 'vr-root.css'
})
export class VrRoot {

  render() {
    return (
      <ion-app>
        <ion-router root="/">
          <ion-route url="/" component="vr-main" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
