// cart.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CartComponent } from './cart/cart.component';
import { CartRoutingModule } from './cart-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartRoutingModule,
    
  ],
  declarations: [CartComponent],
  exports: [CartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartModule { }
