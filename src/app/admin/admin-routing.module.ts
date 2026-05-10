import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { ListComponent } from './accounts/list.component';
import { AddEditComponent } from './accounts/add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: 'accounts',
        component: ListComponent
      },
      {
        path: 'accounts/add',
        component: AddEditComponent
      },
      {
        path: 'accounts/edit/:id',
        component: AddEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}