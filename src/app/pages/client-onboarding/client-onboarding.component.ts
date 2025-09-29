import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { CommonModule, NgIf } from '@angular/common';
import { ClientFormHelper } from '../../shared/client-form.helper';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FloatLabel } from 'primeng/floatlabel';
import { ProvinceService } from '../../services/province.service';
import { MaritalStatusService } from '../../services/marital-status.service';
import { PreferredLanguageService } from '../../services/preferred-language.service';
import { QualificationService } from '../../services/qualification.service';
import { Router } from '@angular/router';
import { DataCleanerHelper } from '../../shared/data-cleaner.helper';

@Component({
  selector: 'app-add-client-form',
  templateUrl: './client-onboarding.component.html',
  styleUrls: ['./client-onboarding.component.scss'],
  standalone: true,
  imports: [CommonModule,NgIf,FloatLabel, ReactiveFormsModule, InputTextModule, DropdownModule, ButtonModule, MessageModule, ToastModule],
  providers: [MessageService],
})


export class AddClientFormComponent {
  @Output() close = new EventEmitter<void>();
  @Input() clientToEdit: ClientService | null = null;

  clientForm: FormGroup;
  provinces: any[]|undefined;
  maritalStatuses: any[]|undefined;
  languages: any[]|undefined;
  qualifications: any[]|undefined;
  isSaving = false;

  constructor(private fb: FormBuilder, private clientService: ClientService,private readonly provinceService: ProvinceService,
    private readonly maritalStatusService:MaritalStatusService,
    private readonly prefereredLanguageService:PreferredLanguageService , 
    private readonly qualificationService:QualificationService,
    private router: Router,
    private readonly dataCleanerHelper: DataCleanerHelper
  ) {
    
    this.provinceService.getAll().subscribe((provinces) => {
      this.provinces = this.dataCleanerHelper.stripReferenceProps(provinces);
    });
    this.maritalStatusService.getAll().subscribe((statuses) => {
      this.maritalStatuses = this.dataCleanerHelper.stripReferenceProps(statuses);
    });
    this.prefereredLanguageService.getAll().subscribe((languages) => {
      this.languages = this.dataCleanerHelper.stripReferenceProps(languages);
    });
    this.qualificationService.getAll().subscribe((qualifications) => {
      this.qualifications = this.dataCleanerHelper.stripReferenceProps(qualifications);
    });

    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      identityNumber: ['', [Validators.required, dataCleanerHelper.southAfricanIdValidator]], // Add custom SA ID validator if needed
      employer: [''],
      mobileNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      physicalAddress1: [null, Validators.required],
      physicalAddress2: [''],
      postalCode: [null, Validators.required],
      provinceID: [null, Validators.required],
      maritalStatusID: [null, Validators.required],
      preferredLanguageID: [null, Validators.required],
      qualificationID: [null, Validators.required]
    });
  }

  ngOnInit(): void {

    // prefill the form 
  

  }

  
  isInvalid(controlName: string): boolean {
    const control = this.clientForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  
  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const advisorId = parseInt(localStorage.getItem('advisorId') || '0', 10);
    const payload = ClientFormHelper.toPayload(this.clientForm.value, advisorId);

    // Debugging line to check the payload before submission
    console.log('Submitting payload:', payload) 

    // Call the service to add the client
    this.clientService.create(payload).subscribe({
      next: () => {
        console.log('Client added successfully');
        this.isSaving = false;

        this.router.navigate(['/home/clients']).then(()=>{
          window.location.reload();
        });
        this.close.emit();

      },
      error: (err) => {
        console.error('Error adding client:', err)
        this.isSaving = false;}
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.clientForm.patchValue({ bankStatement: file });
    }
  }
}
