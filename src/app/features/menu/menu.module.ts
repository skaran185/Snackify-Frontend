import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuListComponent } from './menu-list/menu-list.component';
import { ItemCustomizationModalComponent } from './item-customization-modal/item-customization-modal.component';
import { MenuNavigationComponent } from './menu-navigation/menu-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuRoutingModule
  ],
  declarations: [MenuListComponent, ItemCustomizationModalComponent, MenuNavigationComponent],
})
export class MenuModule { }
