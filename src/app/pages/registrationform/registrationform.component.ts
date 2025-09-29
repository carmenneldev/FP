import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProvinceService } from '../../services/province.service';
import { Province } from '../../models/province.model';
import { FinancialAdvisorService } from '../../services/financial-advisor.service';
import { UserCredentialService } from '../../services/user-credential.service';
import { FinancialAdvisor } from '../../models/financial-advisor.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {ContactFormComponent} from '../../shared/contact-form/contact-form.component';
import { DataCleanerHelper } from '../../shared/data-cleaner.helper';
import { FloatLabel } from "primeng/floatlabel";
 


export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const verifyPassword = group.get('verifyPassword')?.value;
  return password === verifyPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-registrationform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContactFormComponent, RouterLink, InputTextModule, DropdownModule, ButtonModule, MessageModule, ToastModule, FloatLabel],
  providers: [MessageService],
  templateUrl: './registrationform.component.html',
  styleUrl: './registrationform.component.scss'
})
export class RegistrationformComponent implements OnInit {
  imagePath: string = 'assets/images/Logo_Company.png';
  backgroundImagePath = 'assets/images/whiteVector.png';
  provinces: Province[] = [];

  registrationForm: FormGroup;

  constructor(
    private readonly provinceService: ProvinceService,
    private readonly financialAdvisorService: FinancialAdvisorService,
    private readonly userCredentialService: UserCredentialService,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly location: Location,
    private readonly dataCleanerHelper: DataCleanerHelper
  ) {
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      identityNumber: new FormControl('', [Validators.required, this.dataCleanerHelper.southAfricanIdValidator]),
      mobileNumber: new FormControl('', Validators.required),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      physicalAddress1: new FormControl('', Validators.required),
      physicalAddress2: new FormControl(''),
      provinceID: new FormControl(0, Validators.required),
      postalCode: new FormControl('', Validators.required),
      fscA_Number: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      verifyPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.provinceService.getAll().subscribe((provinces) => {
      this.provinces = this.dataCleanerHelper.stripReferenceProps(provinces);
    });
  }

  isPasswordMismatch(): boolean {
    return !!(this.registrationForm.errors?.['passwordMismatch'] &&
      (this.registrationForm.get('verifyPassword')?.dirty || this.registrationForm.get('verifyPassword')?.touched));
  }

  isInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registrationForm.invalid) return;

    const advisorPayload: FinancialAdvisor = {
      id: 0,
      firstName: this.registrationForm.value.firstName!,
      surname: this.registrationForm.value.surname!,
      identityNumber: this.registrationForm.value.identityNumber!,
      mobileNumber: this.registrationForm.value.mobileNumber!,
      emailAddress: this.registrationForm.value.emailAddress!,
      physicalAddress1: this.registrationForm.value.physicalAddress1!,
      physicalAddress2: this.registrationForm.value.physicalAddress2!,
      provinceID: this.registrationForm.value.provinceID!,
      postalCode: this.registrationForm.value.postalCode!,
      fsca_Number: this.registrationForm.value.fscA_Number!
    };

    this.financialAdvisorService.create(advisorPayload).subscribe({
      next: (response) => {
        const advisorRes = this.dataCleanerHelper.stripReferenceProps(response);
        const userCredentialPayload = {
          id: 0,
          userType: 'Advisor',
          userID: advisorRes.id,
          username: this.registrationForm.value.emailAddress!,
          passwordHash: this.registrationForm.value.password!,
          isActive: true,
          lastLogin: new Date().toISOString()
        };

        this.userCredentialService.create(userCredentialPayload).subscribe({
          next: (userRes) => {
            this.messageService.add({ severity: 'success', summary: 'Registration Successful', detail: 'You can now log in.' });
            this.registrationForm.reset();
            this.location.back();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'User Credential Setup Failed', detail: err.message ?? 'Registration failed, please try again.' });
            console.error('User credential creation failed:', err);
          }
        });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Advisor Registration Failed', detail: err.message ?? 'Registration failed, please try again.' });
        console.error('Advisor registration failed:', err);
      }
    });
  }
}
