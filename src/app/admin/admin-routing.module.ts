import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { AuthGuard, AdminGuard } from '../_helpers';

const accountsModule = () =>
  import('./accounts/accounts.module').then(x => x.AccountsModule);

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: OverviewComponent },
      { path: 'accounts', loadChildren: accountsModule, canActivate: [AdminGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}