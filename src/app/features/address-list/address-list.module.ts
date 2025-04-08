import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddressListPageRoutingModule } from './address-list-routing.module';
import { AddressListPage } from './address-list.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddressListPageRoutingModule
  ],
  declarations: [AddressListPage]
})
export class AddressListPageModule {}
