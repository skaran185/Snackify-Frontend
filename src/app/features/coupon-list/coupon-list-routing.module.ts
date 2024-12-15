import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponListPage } from './coupon-list.page';

const routes: Routes = [
  {
    path: '',
    component: CouponListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponListPageRoutingModule {}
