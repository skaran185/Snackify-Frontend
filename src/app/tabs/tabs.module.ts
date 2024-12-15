import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageComponent } from './tabs.page';
import { TabsRoutingModule } from './tabs-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsRoutingModule
  ],
  declarations: [TabsPageComponent]
})
export class TabsPageModule {}
