import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent
  }
];


@NgModule({
  declarations: [OrderListComponent,OrderDetailsComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), IonicModule, FormsModule
  ],
  exports: [RouterModule],
  providers: [CurrencyPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderMgmtModule { }
