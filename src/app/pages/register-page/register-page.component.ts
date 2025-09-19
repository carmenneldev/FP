import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink , Router } from '@angular/router';
import { ContactFormComponent } from "../../shared/contact-form/contact-form.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ContactFormComponent, HeaderComponent],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  imagePath = 'assets/images/Logo_Company.png';
  backgroundImagePath = 'assets/images/whiteVector.png';
  checkMarkIcon = 'assets/Icons/Checkmark.png';
  displayContactForm = false;

  @ViewChild('contentSection') contentSection!: ElementRef;
  @ViewChild('benefitsSection') benefitsSection!: ElementRef;
  @ViewChild('faqsSection') faqsSection!: ElementRef;

  constructor(private router: Router) {}  

  
  openContactForm() {
    this.displayContactForm = true;
  }

  scrollToContent(element: HTMLElement): void {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToTrial(): void {
    this.router.navigate(['Registration']);
  }

  scrollToSection(section: HTMLElement) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  

  scrollTo(section: string) {
    switch (section) {
      case 'content':
        this.contentSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'benefits':
        this.benefitsSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'faqs':
        this.faqsSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }


}
