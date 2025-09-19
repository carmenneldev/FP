import { Component } from '@angular/core';

@Component({
  selector: 'app-otp-login',
  imports: [],
  templateUrl: './otp-login.component.html',
  styleUrl: './otp-login.component.scss',
})
export class OtpLoginComponent {
  otpComponent: boolean = false;

  imagePath = 'assets/images/logo.png';
  vaectorImagePath = 'assets/images/vector.png';
  emailIcon = '';
  passwordIcon = '';

  sendOPT() {
    this.otpComponent = true;
  }
}
