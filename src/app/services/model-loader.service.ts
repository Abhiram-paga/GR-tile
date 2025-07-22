import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModelLoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private loaderController: LoadingController = inject(LoadingController);

  async show(): Promise<void> {
    try {
      this.loading = await this.loaderController.create({
        message: 'Loading...',
        spinner: 'lines',
        translucent: true,
        backdropDismiss: false,
      });
      return this.loading.present();
    } catch (err) {
      console.log('Error while displaying loader', err);
    }
  }

  async hide() {
    try {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
