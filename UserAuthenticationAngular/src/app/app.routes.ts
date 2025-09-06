import { Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UserTable } from './users/components/user-table/user-table';
import { UserCreate } from './users/components/user-create/user-create';
import { UserDetails } from './users/components/user-details/user-details';
import { UserUpdate } from './users/components/user-update/user-update';
import { LoginComponent } from './components/login/login';
import { roleGuard } from './guards/role-guard';
import { AccessDenied } from './components/access-denied/access-denied';
import { RegisterComponent } from './components/register/register'
import { ErrorComponent } from './components/pages/error/error';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { 
    path: 'users',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: UserTable, canActivate: [roleGuard], data: { roles: ['admin'] } },
      { path: 'new', component: UserCreate, canActivate: [roleGuard], data: { roles: ['admin'] } },
      { path: 'profile', component: UserDetails, canActivate: [roleGuard], data: { roles: ['user', 'admin'] } },
      { path: ':id/edit', component: UserUpdate, canActivate: [roleGuard], data: { roles: ['user', 'admin'] } }
    ]
  },
  { path: 'access-denied', component: AccessDenied },
  { path: 'error', component: ErrorComponent  },


  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}