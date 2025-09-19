import { Routes } from '@angular/router';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ClientOverviewComponent } from './pages/client-overview/client-overview.component';
import { AuthGuard } from './guards/auth.guard';
import { MainComponent } from './pages/layout/main/main.component';
import { AgentDashboardComponent } from './pages/agent-dashboard/agent-dashboard.component';
import { ViewClientsComponent } from './pages/view-clients/view-clients.component';
import { LoginComponent } from './pages/login/login.component';
import { RevenueComponent } from './pages/revenue/revenue.component';
import { CrossSellingComponent } from './pages/cross-selling/cross-selling.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { CashFlowComponent } from './pages/cash-flow/cash-flow.component';
import { AssertsLiabilitiesComponent } from './pages/asserts-liabilities/asserts-liabilities.component';
import { ProtectingMyLegacyComponent } from './pages/protecting-my-legacy/protecting-my-legacy.component';
import { AuditTrialComponent } from './pages/audit-trial/audit-trial.component';
import { DataManagementComponent } from './pages/data-management/data-management.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'marketing', pathMatch: 'full'
  },
  {
    path: 'marketing',
    loadComponent: () => import('./pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    // No guard here, allow public access
  },{
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'Registration',
    loadComponent: () => import('./pages/registrationform/registrationform.component').then(m => m.RegistrationformComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'RegisterPage',
    component: RegisterPageComponent
  },
  {
    path: 'clients',
    loadComponent: () => import('./pages/view-clients/view-clients.component').then(m => m.ViewClientsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'client',
    component: ClientOverviewComponent
  },
  {
    path: 'home',
    component: MainComponent,
    children:[
      { path: '', redirectTo:'dashboard', pathMatch:'full' },
      { path: 'dashboard', component: AgentDashboardComponent, canActivate: [AuthGuard] },
      { path: 'clients', component: ViewClientsComponent, canActivate: [AuthGuard] }, 
      { path: 'clientOverview/:id', component: ClientOverviewComponent },
      { path: 'revenue', component: RevenueComponent },
      { path: 'crossSelling', component: CrossSellingComponent },
      { path: 'calender', component: CalenderComponent },
      { path: 'settings', component: DataManagementComponent },
      { path: 'cashflow/:id', component: CashFlowComponent },
      { path: 'assets/:id', component: AssertsLiabilitiesComponent },
      { path: 'legacy/:id', component: ProtectingMyLegacyComponent },
      { path: 'audit/:id', component: AuditTrialComponent }
    ],
  }

];
