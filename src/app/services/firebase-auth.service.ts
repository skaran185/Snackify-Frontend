// auth.service.ts with fixed persistence initialization
import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  user,
  User,
  signInWithPopup
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FAuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private router: Router,
    private platform: Platform
  ) {
    this.user$ = user(this.auth);
    this.auth = getAuth();
    // Set persistence correctly
    this.setPersistence();

    // Handle redirect result
    this.handleRedirectResult();
  }

  // Set appropriate persistence based on platform
  private async setPersistence() {
    try {
      // Use session persistence for mobile platforms and local for web
      await setPersistence(this.auth, browserSessionPersistence);
      console.log('Persistence set to:', 'Session');
    } catch (error) {
      console.error('Error setting persistence:', error);
    }
  }

  // Handle redirect result
  async handleRedirectResult() {
    try {
      const result = await getRedirectResult(this.auth);
      if (result) {
        console.log('User authenticated after redirect:', result.user);
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Redirect authentication error:', error);
    }
  }

  // Google Sign-in method
async signInWithGoogle(): Promise<any> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    // Choose method based on platform
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      try {
        console.log('Attempting popup sign-in');
        const result = await signInWithPopup(this.auth, provider);
        console.log('User signed in via popup:', result.user);
        this.router.navigate(['/home']);
        return result;
      } catch (popupError) {
        console.warn('Popup failed, falling back to redirect:', popupError);
        await signInWithRedirect(this.auth, provider);
        return null;
      }
    } else {
      console.log('Using redirect for mobile authentication');
      await signInWithRedirect(this.auth, provider);
      return null;
    }
  } catch (error) {
    console.error('Google Sign-in Error:', error);
    return null;
  }
}

  // Sign out method
  async signOut() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => user !== null)
    );
  }

  // Get current user
  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }
}