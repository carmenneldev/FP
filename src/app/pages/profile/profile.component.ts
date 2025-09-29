import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { UserCredentialService } from '../../services/user-credential.service';
import { environment } from '../../../environments/environment.dev';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputText,
    Button,
    FileUpload,
    Card,
    Divider,
    Message
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  
  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobileNumber: new FormControl('', [Validators.required]),
    identityNumber: new FormControl(''),
    physicalAddress1: new FormControl(''),
    physicalAddress2: new FormControl(''),
    postalCode: new FormControl('')
  });

  profileImageUrl: string = 'assets/images/user-profileImage.png';
  previousImageUrl: string = 'assets/images/user-profileImage.png';
  selectedFile: File | null = null;
  uploadInProgress: boolean = false;
  saveInProgress: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private userCredentialService: UserCredentialService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Load profile data from API
    this.http.get<any>(`${environment.apiUrl}/Profile`).subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          firstName: profile.firstName || '',
          lastName: profile.surname || '',
          email: profile.emailAddress || '',
          mobileNumber: profile.mobileNumber || '',
          identityNumber: profile.identityNumber || '',
          physicalAddress1: profile.physicalAddress1 || '',
          physicalAddress2: profile.physicalAddress2 || '',
          postalCode: profile.postalCode || ''
        });
        
        // Load profile image dynamically
        if (profile.profileImageUrl) {
          this.profileImageUrl = `${environment.apiUrl}${profile.profileImageUrl}`;
          this.previousImageUrl = this.profileImageUrl;
        } else {
          this.profileImageUrl = 'assets/images/user-profileImage.png';
          this.previousImageUrl = this.profileImageUrl;
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        // Fallback to localStorage if API fails
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          this.profileForm.patchValue({
            firstName: user.userData?.firstName || '',
            lastName: user.userData?.surname || '',
            email: user.userData?.emailAddress || '',
            mobileNumber: user.userData?.mobileNumber || '',
            identityNumber: user.userData?.identityNumber || '',
            physicalAddress1: user.userData?.physicalAddress1 || '',
            physicalAddress2: user.userData?.physicalAddress2 || '',
            postalCode: user.userData?.postalCode || ''
          });
        }
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      // Client-side validation
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file.';
        this.fileUpload.clear();
        return;
      }
      
      if (file.size > 5000000) { // 5MB
        this.errorMessage = 'Image file size must be less than 5MB.';
        this.fileUpload.clear();
        return;
      }
      
      this.errorMessage = '';
      this.previousImageUrl = this.profileImageUrl; // Store current image
      this.selectedFile = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onUploadProfilePicture(): void {
    if (!this.selectedFile) return;

    this.uploadInProgress = true;
    this.errorMessage = '';
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('avatar', this.selectedFile);

    this.http.post<any>(`${environment.apiUrl}/Profile/avatar`, formData).subscribe({
      next: (response) => {
        this.uploadInProgress = false;
        this.selectedFile = null;
        this.fileUpload.clear();
        
        // Update profile image URL with the server response
        if (response.avatarUrl) {
          this.profileImageUrl = `${environment.apiUrl}${response.avatarUrl}`;
          this.previousImageUrl = this.profileImageUrl;
        }
        
        this.successMessage = 'Profile picture updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.uploadInProgress = false;
        this.errorMessage = 'Failed to upload profile picture. Please try again.';
        console.error('Upload error:', error);
      }
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saveInProgress = true;
    this.errorMessage = '';

    // Prepare profile data for API
    const profileData = {
      firstName: this.profileForm.get('firstName')?.value,
      surname: this.profileForm.get('lastName')?.value,
      emailAddress: this.profileForm.get('email')?.value,
      mobileNumber: this.profileForm.get('mobileNumber')?.value,
      identityNumber: this.profileForm.get('identityNumber')?.value,
      physicalAddress1: this.profileForm.get('physicalAddress1')?.value,
      physicalAddress2: this.profileForm.get('physicalAddress2')?.value,
      postalCode: this.profileForm.get('postalCode')?.value
    };

    this.http.put<any>(`${environment.apiUrl}/Profile`, profileData).subscribe({
      next: (response) => {
        this.saveInProgress = false;
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.saveInProgress = false;
        if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Failed to update profile. Please try again.';
        }
        console.error('Profile update error:', error);
      }
    });
  }

  onRemoveProfilePicture(): void {
    this.errorMessage = '';
    
    // Call API to remove profile picture from backend
    this.http.delete<any>(`${environment.apiUrl}/Profile/avatar`).subscribe({
      next: (response) => {
        // Reset to default profile image
        this.profileImageUrl = 'assets/images/user-profileImage.png';
        this.previousImageUrl = this.profileImageUrl;
        this.selectedFile = null;
        this.fileUpload.clear();
        this.successMessage = 'Profile picture removed successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to remove profile picture. Please try again.';
        console.error('Profile picture removal error:', error);
      }
    });
  }
}
