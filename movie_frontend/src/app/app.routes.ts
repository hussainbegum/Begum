import { Routes } from '@angular/router';
import { LoginComponent } from './logincomponent/logincomponent';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { AdminDashboardComponent } from './admin-dashboard-component/admin-dashboard-component';
import { UserDashboardComponent } from './user-dashboard-component/user-dashboard-component';




export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }, // Add this route path
  { path: 'admin', component: AdminDashboardComponent }, // Add this route path
  {path:'user', component: UserDashboardComponent},

  { path: '', redirectTo: 'login', pathMatch: 'full' } // Fallback routing auto-redirects to login
];