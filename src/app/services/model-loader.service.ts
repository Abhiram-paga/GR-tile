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

  async presentAlert(
    header: string,
    message: string,
    isLoginPage: boolean = false
  ): Promise<'cancel' | 'confirm'> {
    try {
      let buttons = [
        {
          text: 'CANCEL',
          role: 'cancel',
        },
        {
          text: 'YES',
          role: 'confirm',
        },
      ];
      if (isLoginPage) {
        buttons = [
          {
            text: 'OK',
            role: 'cancel',
          },
        ];
      }
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: buttons
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
      return role as 'cancel' | 'confirm';
    } catch (err) {
      console.error(err);
      throw new Error('Error in displaying alert');
    }
  }
}
