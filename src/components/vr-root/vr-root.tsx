import { Component, h } from '@stencil/core';
import {toastController} from "@ionic/core";

@Component({
  tag: 'vr-root',
  styleUrl: 'vr-root.css'
})
export class VrRoot {

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
        if (!navigator.serviceWorker) return;
        navigator.serviceWorker
            .getRegistration()
            .then(registration => {

                if (registration === undefined) return;

                registration.addEventListener('updatefound', async () => {

                    const toast = await toastController.create({
                        message: "New version available.",
                        buttons: [{ text: `Install new version of EPE Viewer`, role: 'reload' }],
                        duration: 0
                    });

                    await toast.present();

                    const { role } = await toast.onWillDismiss();

                    if (role === 'reload') {
                        registration.waiting.postMessage("skipWaiting");
                    }
                });

                if (registration?.active) {
                    navigator.serviceWorker.addEventListener(
                        'controllerchange',
                        () => window.location.reload()
                    );
                }
            })
    }

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
