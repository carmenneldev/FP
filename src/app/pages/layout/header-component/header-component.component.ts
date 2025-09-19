import { NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute, RouterLink} from '@angular/router';
import { filter } from 'rxjs/operators';
import { ClientStateService } from '../../../services/client-state.service';
import { MenuItem } from 'primeng/api';
import { Menu } from "primeng/menu";



@Component({
  selector: 'app-header-component',
  imports: [NgIf, RouterLink, Menu],
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.scss']
})
export class HeaderComponentComponent implements OnInit {

  userProfile = 'assets/images/user-profileImage.png';
  notificationIcon = 'assets/Icons/bellIcon.png'

  showClientNavigation = false;
  // isDropdownOpen = false;
  currentUrl: string = '';
  selectedClientId: number | null = null;
  clientId: number = 0;

   items: MenuItem[] = [];

   @ViewChild('menu') menu!: Menu;
   @ViewChild('userProfileContainer', { read: ElementRef }) userProfileContainer!: ElementRef;



  constructor(private router: Router,private clientStateService: ClientStateService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.showClientNavigation = event.urlAfterRedirects.includes('/home/clientOverview');
      });
  }



  ngOnInit(): void {

    this.items =  [
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => this.openSettings()
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      }
    ];



    // this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     const segments = this.router.url.split('/');
    //     const idSegment = segments.find((seg, idx) => ['clientOverview', 'cashflow', 'assets', 'legacy', 'audit'].includes(seg));
    //     if (idSegment) {
    //       const id = Number(segments[segments.indexOf(idSegment) + 1]);
    //       if (!isNaN(id)) {
    //         this.clientId = id;
    //         this.showClientNavigation = true;
    //         return;
    //       }
    //     }

    //     this.showClientNavigation = false;
    //   });

      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url;
      const routesWithClientNav = [
        '/home/clientOverview',
        '/home/cashflow',
        '/home/assets',
        '/home/legacy',
        '/home/audit'
      ];
      this.showClientNavigation = routesWithClientNav.some(route => url.includes(route));

      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      const maybeId = parseInt(lastPart);
      this.clientId = !isNaN(maybeId) ? maybeId : 0;
    });

      
  }



  // toggleDropdown() {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  //   console.log("Profile menu toggled:", this.isDropdownOpen);
  // }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  openSettings() {
    // Logic for opening settings page
    this.router.navigate(['/settings']);
  }
  isActive(path: string): boolean {
    return location.pathname.includes(path);
  }
}
