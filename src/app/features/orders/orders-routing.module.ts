import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  // {
  //   path: 'payment-success',
  //   component: PaymentSuccessComponent
  // },
  // {
  //   path: 'payment-failed',
  //   component: PaymentFailedComponent
  // }
];


@NgModule({
  declarations: [OrderDetailsComponent],
  imports: [RouterModule.forChild(routes), IonicModule, CommonModule],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersRoutingModule { }
