import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
@Injectable({
  providedIn: 'root',
})
export class ModelLoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private loaderController: LoadingController = inject(LoadingController);
  private alertController: AlertController = inject(AlertController);

  public alertButtons = [
    {
      text: 'CANCEL',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'YES',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  async showLoader(): Promise<void> {
    try {
      this.loading = await this.loaderController.create({
        message: 'Please Wait...',
        spinner: 'lines',
        translucent: true,
        backdropDismiss: false,
      });
      return this.loading.present();
    } catch (err) {
      console.log('Error while displaying loader', err);
    }
  }

  async hideLoader() {
    try {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async presentAlert(header: string, message: string) {
    try {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: this.alertButtons,
      });

      await alert.present();
    } catch (err) {
      console.log(err);
    }
  }
}
