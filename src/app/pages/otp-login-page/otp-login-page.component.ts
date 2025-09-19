import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-otp-login-page',
  imports: [RouterLink],
  templateUrl: './otp-login-page.component.html',
  styleUrl: './otp-login-page.component.scss',
})
export class OtpLoginPageComponent {
  imagePath = 'assets/images/logo.png';
  vaectorImagePath = 'assets/images/vector.png';
  backgroundImagePath = 'assets/images/whiteVector.png';
  emailIcon = '';
  passwordIcon = '';
}
