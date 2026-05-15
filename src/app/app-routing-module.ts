import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard, AdminGuard } from './_helpers';

const accountModule = () =>
  import('./account/account.module').then(x => x.AccountModule);

const profileModule = () =>
  import('./profile/profile.module').then(x => x.ProfileModule);

const adminModule = () =>
  import('./admin/admin.module').then(x => x.AdminModule);

const accountsModule = () =>
  import('./admin/accounts/accounts.module').then(x => x.AccountsModule);

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadChildren: accountModule
  },
  {
    path: 'profile',
    loadChildren: profileModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: adminModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/accounts',
    loadChildren: accountsModule,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}