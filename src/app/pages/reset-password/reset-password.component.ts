import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],  // <-- fix here
  standalone: true
})
export class ResetPasswordComponent {
  imagePath: string = 'assets/images/Logo_Company.png';
  backgroundImagePath = 'assets/images/whiteVector.png';
  resetForm: FormGroup;
  successMessage = '';
  isSubmitted = false;  
  // showErrorPopup = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.resetForm.invalid) {
      // this.showErrorPopup = true;
      return;  
    }

    // calling service here to send reset link

    this.successMessage = 'A reset link has been sent to your email.';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
