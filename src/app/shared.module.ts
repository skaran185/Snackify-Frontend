import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingCartComponent } from './features/cart/floating-cart/floating-cart.component';
import { IonicModule } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [FloatingCartComponent],
    imports: [CommonModule, IonicModule,BrowserAnimationsModule],
    exports: [FloatingCartComponent] // Export the component
})
export class SharedModule { }
