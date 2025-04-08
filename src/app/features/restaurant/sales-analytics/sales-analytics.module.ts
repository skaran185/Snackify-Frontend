import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), IonicModule, FormsModule,
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CurrencyPipe]
})
export class SalesAnalyticsModule { }
