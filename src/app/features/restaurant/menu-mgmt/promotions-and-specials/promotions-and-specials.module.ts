import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotionsAndSpecialsPageRoutingModule } from './promotions-and-specials-routing.module';

import { PromotionsAndSpecialsPage } from './promotions-and-specials.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotionsAndSpecialsPageRoutingModule
  ],
  declarations: [PromotionsAndSpecialsPage]
})
export class PromotionsAndSpecialsPageModule {}
