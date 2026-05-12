import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout.component';
import { SubnavComponent } from './subnav.component';
import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [
    LayoutComponent,
    SubnavComponent,
    OverviewComponent
  ]
})
export class AdminModule {}