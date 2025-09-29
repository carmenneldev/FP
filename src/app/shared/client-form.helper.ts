import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ClientFormHelper {
  
  static buildForm(fb: FormBuilder): FormGroup {
  return fb.group({
    // financialAdvisorID :,
    firstName: ['', Validators.required],
    surname: ['', Validators.required],
    identityNumber: ['', Validators.required],
    employer: [''],
    mobileNumber: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    physicalAddress1: [''],
    physicalAddress2: [''],
    postalCode: [''],
    provinceID: ['', Validators.required],
    maritalStatusID: ['', Validators.required],
    preferredLanguageID: ['', Validators.required],
    qualificationID: ['', Validators.required],
    bankStatement: [null] // optional for now
  });
}


  static toPayload(formValue: any,advisorId: number ): any {
  return {
    // DO NOT include 'id' for new client creation - let database auto-generate it
    financialAdvisorID: advisorId,
    firstName: formValue.firstName,
    surname: formValue.surname,
    identityNumber: formValue.identityNumber,
    employer: formValue.employer || '',
    mobileNumber: formValue.mobileNumber || '',
    maritalStatusID: formValue.maritalStatusID || 1,
    emailAddress: formValue.emailAddress || '',
    physicalAddress1: formValue.physicalAddress1 || '',
    physicalAddress2: formValue.physicalAddress2 || '',
    provinceID: formValue.provinceID || 0,
    postalCode: formValue.postalCode || '',
    preferredLanguageID: formValue.preferredLanguageID || 0,
    qualificationID: formValue.qualificationID || 0
    // Removed navigation properties and arrays that don't belong in the database payload
  };
}


static extractDobFromId(idNumber: string): string | null {
    if (!/^\d{13}$/.test(idNumber)) return null;

    const year = parseInt(idNumber.slice(0, 2), 10);
    const month = idNumber.slice(2, 4);
    const day = idNumber.slice(4, 6);

    const currentYear = new Date().getFullYear() % 100;
    const fullYear = year <= currentYear ? 2000 + year : 1900 + year;

    return `${day}-${month}-${fullYear}`;
  }

}
