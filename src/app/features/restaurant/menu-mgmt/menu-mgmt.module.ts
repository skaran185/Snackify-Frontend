import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenulistComponent } from './menulist/menulist.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuItemModalComponent } from './menu-item-modal-component/menu-item-modal-component.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { AddEditMenuItemComponent } from './add-edit-menu-item/add-edit-menu-item.component';

const routes: Routes = [
  {
    path: '',
    component: MenulistComponent
  }
];

@NgModule({
  declarations: [MenulistComponent, MenuItemModalComponent,AddEditCategoryComponent,AddEditMenuItemComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), IonicModule, FormsModule, ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: [CurrencyPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuMgmtModule { }
