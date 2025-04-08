import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotionsAndSpecialsPage } from './promotions-and-specials.page';

const routes: Routes = [
  {
    path: '',
    component: PromotionsAndSpecialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsAndSpecialsPageRoutingModule {}
