import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { OrderListComponent } from '../order-mgmt/order-list/order-list.component';
import { DashboardComponent } from '../sales-analytics/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenulistComponent } from '../menu-mgmt/menulist/menulist.component';
import { SettingComponent } from '../setting/setting.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'menu-mgmt', component: MenulistComponent },
      { path: 'setting', component: SettingComponent },
      // Add other child routes here
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Redirect to dashboard
    ]
  }
];

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class HomeModule { }
