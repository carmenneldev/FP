import { Component } from '@angular/core';
import { LoginComponent } from "./pages/login/login.component";
import { LandingPageDashboardComponent } from "./pages/landing-page-dashboard/landing-page-dashboard.component";
import { AgentDashboardComponent } from "./pages/agent-dashboard/agent-dashboard.component";
import { MainComponent } from './pages/layout/main/main.component';
import { RegistrationformComponent } from "./pages/registrationform/registrationform.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [LoginComponent, LandingPageDashboardComponent, AgentDashboardComponent, LandingPageDashboardComponent, LoginComponent, MainComponent, RegistrationformComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'flight_plan';
  showLogin: boolean = true;

  authMeth: string = '';
  showRegistration = false;
  
  onShowRegistration() {
    this.showLogin = false;
    this.showRegistration = true;
  }
  
  onBackToLogin() {
    this.showLogin = true;
    this.showRegistration = false;
  }
  
  onLogin() {
    this.showLogin = false;
    this.showRegistration = false;
  }
}
