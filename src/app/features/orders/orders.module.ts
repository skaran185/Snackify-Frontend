import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { PaymentComponent } from './payment/payment.component';


@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersModule { }
