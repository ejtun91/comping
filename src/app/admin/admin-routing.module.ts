import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './containers/users/users.component';
import { NewUserComponent } from './containers/new/new-user.component';
import { EditUserComponent } from './containers/edit/edit-user.component';
import { UsersGuard } from './guards/users.guard';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [UsersGuard],
    children: [
      { path: '', redirectTo: 'lists', pathMatch: 'full' },
      {
        path: 'lists',
        component: UsersListComponent,
      },
      {
        path: 'new',
        component: NewUserComponent,
      },
      {
        path: ':id',
        component: EditUserComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
