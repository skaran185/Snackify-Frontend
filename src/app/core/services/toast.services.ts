import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {}

  // Method to show error message
  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',  // Red color for error
      position: 'top',  // Position the toast at the top of the screen
    });
    toast.present();
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      color: 'success',  // Red color for error
      position: 'top',  // Position the toast at the top of the screen
    });
    toast.present();
  }
}
