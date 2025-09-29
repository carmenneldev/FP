import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';






@Component({
  selector: 'app-contact-form',
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  imports: [DialogModule, ReactiveFormsModule, InputTextModule, ButtonModule, Textarea]
})
export class ContactFormComponent {
  contactForm: FormGroup;
  

  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();


  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }



  submit() {
    if (this.contactForm.valid) {
      this.formSubmitted.emit(this.contactForm.value);
      this.contactForm.reset();
      this.close();
    }
  }
  
  close() {
    this.display = false;
    this.displayChange.emit(false);
    this.onClose.emit();
  }
}
