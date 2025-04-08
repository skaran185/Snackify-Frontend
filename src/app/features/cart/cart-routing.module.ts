import { NgModule } from '@angular/core';
import { CartComponent } from './cart/cart.component';
import { RouterModule, Routes } from '@angular/router';

type NewType = Routes;

const routes: NewType = [
  { path: '', component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
