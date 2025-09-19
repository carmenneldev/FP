import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class DataCleanerHelper {

  // Method to strip $ref and $id properties from an object
  stripReferenceProps(obj: any): any {
    if (obj && typeof obj === 'object' && Array.isArray(obj.$values)) {
      return obj.$values.map((item: any) => this.stripReferenceProps(item));
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.stripReferenceProps(item));
    } else if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const key of Object.keys(obj)) {
        if (key !== '$id' && key !== '$ref') {
          result[key] = this.stripReferenceProps(obj[key]);
        }
      }
      return result;
    }
    return obj;
  }

  southAfricanIdValidator(control: AbstractControl): ValidationErrors | null {
    const id = control.value;
    if (!id) return null;
    if (!/^\d{13}$/.test(id)) {
      return { invalidIdFormat: true };
    }
  
    // Luhn check
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      let digit = +id[i];
      if (i % 2 === 0) {
        sum += digit;
      } else {
        let dbl = digit * 2;
        sum += dbl > 9 ? dbl - 9 : dbl;
      }
    }
    if (sum % 10 !== 0) {
      return { invalidIdChecksum: true };
    }
    return null;
  }

  getDateOfBirthFromId(idNumber: string): string {
        if (!idNumber || idNumber.length < 6) return 'N/A';
        const year = idNumber.substring(0, 2);
        const month = idNumber.substring(2, 4);
        const day = idNumber.substring(4, 6);
        // Assume 1900-1999 for years >= 00 and <= 99 (you can improve this logic if needed)
        const fullYear = parseInt(year, 10) > 30 ? '19' + year : '20' + year;
        return `${fullYear}-${month}-${day}`;
      }


  getGenderFromId(idNumber: string): string {
      if (!idNumber || idNumber.length < 10) return 'N/A';
      const genderDigits = parseInt(idNumber.substring(6, 10), 10);
      return genderDigits < 5000 ? 'Female' : 'Male';
    }

}