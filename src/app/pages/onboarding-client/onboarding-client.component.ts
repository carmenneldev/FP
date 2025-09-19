import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-onboarding-client',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './onboarding-client.component.html',
  styleUrl: './onboarding-client.component.scss'
})
export class OnboardingClientComponent {

  userform : FormGroup = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    identificationNumber: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    dateOfBirth: new FormControl("", Validators.required),
    status: new FormControl("", Validators.required),
  })

  addUser(){
    console.log(this.userform.value)
  }
}
