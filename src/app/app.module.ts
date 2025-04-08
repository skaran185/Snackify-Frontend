import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, LoadingController } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { SharedModule } from './shared.module';
import { TabsPageComponent } from './features/features/tabs-page/tabs-page.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';

// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { provideFirebaseApp, FirebaseAppModule } from '@angular/fire/app';
import { provideAuth, AuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
// Initialize Auth
const auth = getAuth(app);

@NgModule({
  declarations: [TabsPageComponent, AppComponent, SplashScreenComponent],
  imports: [
    HttpClientModule, 
    SharedModule, 
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    // Properly typed Firebase imports
    AuthModule,
    FirebaseAppModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LoadingController,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // Provide Firebase in providers array instead
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }