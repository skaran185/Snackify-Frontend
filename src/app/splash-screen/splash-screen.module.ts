import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SplashScreenComponent } from './splash-screen.component';

@NgModule({
  declarations: [SplashScreenComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [SplashScreenComponent]
})
export class SplashScreenModule { }