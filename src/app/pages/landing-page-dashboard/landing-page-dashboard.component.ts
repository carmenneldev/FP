import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page-dashboard',
  imports: [RouterModule],
  templateUrl: './landing-page-dashboard.component.html',
  styleUrl: './landing-page-dashboard.component.scss'
})
export class LandingPageDashboardComponent{


  imagePath = 'assets/images/Logo_Company.png';
  userProfile = 'assets/images/user-profileImage.png';
  notificationIcon = 'assets/Icons/bellIcon.png';
  addIcon = 'assets/Icons/AddIcon.png';
  dropdownIcon = 'assets/Icons/dropdownIcon.png';
  searchIcon = 'assets/Icons/searchIcon.png';
  greateThanIcon ='assets/Icons/greaterThan.png';
  lessThanIcon = 'assets/Icons/lessThan.png';


  addClient(){
    console.log('Hello Im working');
    // this.showForm = true;
  }
}
