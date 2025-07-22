import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastController: ToastController = inject(ToastController);
  async showToast(
    message: string,
    icon: string = 'checkmarkCircleOutline',
    color: 'success' | 'danger' | 'warning' | 'medium' = 'success',
    duration: number = 2000,
    position: 'top' | 'middle' | 'bottom' = 'top'
  ): Promise<unknown> {
    try {
      const toast = await this.toastController.create({
        message,
        color,
        icon,
        duration,
        position,
      });
      await toast.present();
      return;
    } catch (err) {
      return err;
    }
  }
}
