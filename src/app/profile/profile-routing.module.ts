import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  },
  {
    path: 'update',
    component: UpdateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}