import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { AdminGuard } from '../../_helpers';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: ListComponent
      },
      {
        path: 'add',
        component: AddEditComponent
      },
      {
        path: 'edit/:id',
        component: AddEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}