import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from "primeng/button";

@Component({
  selector: 'app-aside-navigation',
  imports: [RouterLink, NgIf, NgClass, Button],
  templateUrl: './aside-navigation.component.html',
  styleUrl: './aside-navigation.component.scss'
})
export class AsideNavigationComponent {

  imagePath = 'assets/images/Logo_Company.png';
  dashboard = '';
  clients = '';
  revenue = '';
  crossSelling = '';
  calender = '';
  setting = '';

  collapsed = false;
  
  @Output() toggleSidebar = new EventEmitter<void>();


  toggleMenu() {
    this.collapsed = !this.collapsed;
  }
}
