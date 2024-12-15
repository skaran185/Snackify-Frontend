import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingCartComponent } from './features/cart/floating-cart/floating-cart.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [FloatingCartComponent],
    imports: [CommonModule, IonicModule],
    exports: [FloatingCartComponent] // Export the component
})
export class SharedModule { }
