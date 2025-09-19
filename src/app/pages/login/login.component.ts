import { Component, EventEmitter, Output, inject} from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest, UserCredentialService, LoginResponse } from '../../services/user-credential.service';
import { UserCredential } from '../../models/user-credential.model';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { DataCleanerHelper } from '../../shared/data-cleaner.helper';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink,CommonModule, ReactiveFormsModule, NgIf, NgClass,MessageModule,RadioButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  imagePath = 'assets/images/logo.png';
  backgroundImagePath = 'assets/images/whiteVector.png';
  advisorsImage = 'assets/images/AdvisorsImage.webp'


  emailIcon = '';
  passwordIcon = '';
  error = '';
  user: UserCredential | null = null;
  isLoggingIn = false;
  isSubmitted = false;
  showPassword: boolean = false;


  // phone number related properties
  maxLength = 9;
  isLoadingOTP = false;
  countries = [
      { code: '+27', length: 9 }, // South Africa: 9 digits after +27
      { code: '+91', length: 10 }, // India
      { code: '+44', length: 10 }, // UK
      { code: '+61', length: 9 }   // Australia
    ];


  @Output() login = new EventEmitter<void>();
  @Output() showRegistration = new EventEmitter<void>();

  authMeth: string = 'Password';

  constructor(private readonly userCredentialService: UserCredentialService, private readonly router: Router,
    private readonly dataCleanerHelper: DataCleanerHelper
  ) {}



  ngOnInit() {
    this.updateMaxLength();
    this.otpForm.get('countryCode')?.valueChanges.subscribe(() => {
      this.updateMaxLength();
      this.otpForm.get('phone')?.setValue('');
  });
}




  userlogin: FormGroup = new FormGroup({
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });



  otpForm: FormGroup = new FormGroup({
    countryCode: new FormControl('+27', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });

  onLoginClick(): void {
    this.isLoggingIn = true;
    this.isSubmitted = true;

    if (this.userlogin.invalid) {
      this.userlogin.markAllAsTouched();
      this.isLoggingIn = false;
      return;
    }

    this.isLoggingIn = true;
    this.initiateLoginCheck();
  }





  onShowRegistrationClick() {
    this.showRegistration.emit();
  }

  initiateLoginCheck() {
    console.log(this.userlogin.value.emailAddress);
    console.log(this.userlogin.get('emailAddress')?.value);


    const request: LoginRequest = {
      username: this.userlogin.value.emailAddress || '',
      password: this.userlogin.value.password || ''
    };
  
    this.userCredentialService.login(request).subscribe({
      next: (data: LoginResponse) => {
        const response = this.dataCleanerHelper.stripReferenceProps(data);
        this.user = response.user;
        this.error = '';
        this.login.emit();

        console.log('Login successful:', response); // debugging line

        // Save values to localStorage
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('userEmail', JSON.stringify(response.user.username));
        localStorage.setItem('userId', JSON.stringify(response.user.userID));

        //  Saving  advisor ID separately (assumes 'id' holds the advisor's ID)
        if (response.user?.id) {
          localStorage.setItem('advisorId', response.user.id.toString());
        }

        this.router.navigate(['/home']); 
      },
      error: () => {
        this.error = 'Invalid username or password';
        this.user = null;
        this.isLoggingIn = false;

      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  

  updateMaxLength() {
    const countryCode = this.otpForm.get('countryCode')?.value;
    const country = this.countries.find(c => c.code === countryCode);
    this.maxLength = country ? country.length : 10;
    }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const numericOnly = input.value.replace(/\D/g, '');
    this.otpForm.get('phone')?.setValue(numericOnly, { emitEvent: false });
    }



  sendOTP() {

    if (this.otpForm.invalid) {
        this.otpForm.markAllAsTouched();
        return;
      }
  
    // Simulate sending OTP
    this.isLoadingOTP = true;

    const countryCode = this.otpForm.get('countryCode')?.value;
    const phone = this.otpForm.get('phone')?.value;

    setTimeout(() => {
    this.isLoadingOTP = false;
    //  additional logic to handle OTP sending can be added here
    console.log(`OTP sent to ${countryCode}${phone}`);
    console.log("OTP sent");
  }, 2000);

  }
}
