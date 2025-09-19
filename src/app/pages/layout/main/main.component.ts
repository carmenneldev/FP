import { Component, HostListener } from '@angular/core';
import { HeaderComponentComponent } from '../header-component/header-component.component';
import { AsideNavigationComponent } from '../aside-navigation/aside-navigation.component';
import { RouterOutlet } from '@angular/router';
import { Button } from "primeng/button";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [HeaderComponentComponent, AsideNavigationComponent, RouterOutlet, Button,NgIf],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

 isSidebarVisible: boolean = true;


  imagePath = 'assets/images/Logo_Company.png';

  ngOnInit() {
    this.updateSidebarVisibility(window.innerWidth);
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSidebarVisibility(event.target.innerWidth);
  }

  private updateSidebarVisibility(width: number) {
    // If desktop size, always show sidebar
    if (width > 768) {
      this.isSidebarVisible = true;
    }
    // If mobile, respect toggle state
  }

}
