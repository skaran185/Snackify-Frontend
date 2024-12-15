import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponListPageRoutingModule } from './coupon-list-routing.module';

import { CouponListPage } from './coupon-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponListPageRoutingModule
  ],
  declarations: [CouponListPage]
})
export class CouponListPageModule {}
