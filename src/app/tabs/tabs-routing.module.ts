// tabs-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'food', pathMatch: 'full' },
  { path: 'food', loadChildren: () => import('../features/home/home.module').then(m => m.HomeModule) },
  { path: 'reorder', loadChildren: () => import('../features/orders/orders.module').then(m => m.OrdersModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
