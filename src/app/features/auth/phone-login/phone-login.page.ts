// login.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './phone-login.page.html',
  styleUrls: ['./phone-login.page.scss'],
})
export class PhoneLoginPage implements OnInit {
  isLoading = false;
  authError!: string;

  constructor(
    private authService: FAuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    this.authService.isAuthenticated().subscribe((isAuth:any) => {
      if (isAuth) {
        this.router.navigate(['/home']);
      }
    });
  }

  async googleSignIn() {
    this.authError = '';
    await this.presentLoading('Signing in with Google...');
    
    try {
      const result = await this.authService.signInWithGoogle();
      this.dismissLoading();
      
      if (result) {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      this.dismissLoading();
      
      // Record detailed error information
      this.authError = this.getReadableErrorMessage(error);
      
      // Show detailed error message
      await this.presentAlert('Authentication Failed', this.authError);
      console.error('Google Sign-in Error:', error);
    }
  }

  getReadableErrorMessage(error: any): string {
    // Parse the error to provide a more user-friendly message
    if (!error) return 'Unknown error occurred';
    
    if (error.code) {
      switch(error.code) {
        case 'auth/popup-blocked':
          return 'Sign-in popup was blocked by your browser. Please allow popups for this website.';
        case 'auth/popup-closed-by-user':
          return 'Sign-in was cancelled. Please try again.';
        case 'auth/unauthorized-domain':
          return 'This domain is not authorized for OAuth operations. Please contact support.';
        case 'auth/cancelled-popup-request':
          return 'The authentication request was cancelled.';
        case 'auth/user-disabled':
          return 'This user account has been disabled.';
        case 'auth/operation-not-allowed':
          return 'This operation is not allowed. Please contact support.';
        case 'auth/user-token-expired':
          return 'Your authentication session has expired. Please sign in again.';
        case 'auth/web-storage-unsupported':
          return 'Web storage is not supported or is disabled in this browser.';
        case 'auth/network-request-failed':
          return 'A network error occurred. Please check your internet connection.';
        default:
          return `Error: ${error.message || error.code}`;
      }
    }
    
    return error.message || 'An unexpected authentication error occurred.';
  }

  async presentLoading(message: string) {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message,
      spinner: 'circles'
    });
    await loading.present();
  }

  async dismissLoading() {
    this.isLoading = false;
    if (this.loadingController) {
      await this.loadingController.dismiss();
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'auth-alert'
    });
    await alert.present();
  }
}