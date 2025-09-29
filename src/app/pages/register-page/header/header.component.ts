import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
   imagePath = 'assets/images/Logo_Company.png';
   displayContactForm = false;


  @Output() scrollToSection = new EventEmitter<string>();

  onScrollTo(section: string) {
    this.scrollToSection.emit(section);
  }

  openContactForm() {
    this.displayContactForm = true;
  }
}
