import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashBoardService } from 'src/app/core/services/dashboard.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingComponent } from './setting/setting.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./order-mgmt/order-mgmt.module').then(m => m.OrderMgmtModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./sales-analytics/sales-analytics.module').then(m => m.SalesAnalyticsModule)
  },
  {
    path: 'menu-mgmt',
    loadChildren: () => import('./menu-mgmt/menu-mgmt.module').then(m => m.MenuMgmtModule)
  },
  {
    path: 'setting',
    component: SettingComponent
  }
];

@NgModule({
  declarations: [SettingComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule, IonicModule, FormsModule, ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: [DashBoardService]
})
export class RestaurantModule { }
