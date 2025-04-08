// loader.service.ts
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private loadingCount = 0;

  constructor(
    private loadingController: LoadingController,
    private platform: Platform
  ) {
    // Handle app state changes
    this.platform.pause.subscribe(() => {
      this.forceHide();
    });

    this.platform.resume.subscribe(() => {
      this.forceHide();
    });

    // Handle page reloads and navigation
    window.addEventListener('beforeunload', () => {
      this.forceHide();
    });
  }

  async show(message: string = 'Please wait...') {
    try {
      // First ensure any existing loaders are cleared
      await this.loadingController.dismiss();
      this.loading = null;
      
      this.loadingCount++;
      
      if (!this.loading) {
        this.loading = await this.loadingController.create({
          message,
          spinner: 'circular',
          translucent: true,
          cssClass: 'custom-loader',
          backdropDismiss: false
        });
        
        await this.loading.present();
      }
    } catch (error) {
      console.error('Error showing loader:', error);
      this.loadingCount = 0;
      this.loading = null;
    }
  }

  async hide() {
    try {
      this.loadingCount--;
      
      if (this.loadingCount <= 0) {
        this.loadingCount = 0;
        
        if (this.loading) {
          await this.loading.dismiss();
          this.loading = null;
        }
        
        // Additional cleanup
        await this.loadingController.dismiss();
      }
    } catch (error) {
      console.error('Error hiding loader:', error);
      this.reset();
    }
  }

  async forceHide() {
    try {
      this.loadingCount = 0;
      
      if (this.loading) {
        await this.loading.dismiss();
      }
      
      // Additional cleanup
      await this.loadingController.dismiss();
    } catch (error) {
      console.error('Error force hiding loader:', error);
    } finally {
      this.loading = null;
    }
  }

  reset() {
    this.loadingCount = 0;
    this.loading = null;
  }
}
