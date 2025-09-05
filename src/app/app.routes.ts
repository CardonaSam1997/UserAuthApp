import { Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UserTable } from './users/components/user-table/user-table';
import { UserCreate } from './users/components/user-create/user-create';
import { UserDetails } from './users/components/user-details/user-details';
import { UserUpdate } from './users/components/user-update/user-update';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) },
  { 
    path: 'users',
    component: DashboardComponent,   
    canActivate: [authGuard],
    children: [
      { path: '', component: UserTable },      
      { path: 'new', component: UserCreate },
      { path: 'profile', component: UserDetails },
      { path: ':id/edit', component: UserUpdate },
    ]

  },
  { path: '**', redirectTo: '/login' }
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}