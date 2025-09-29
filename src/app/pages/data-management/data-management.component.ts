import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { PolicyManagementComponent } from "./components/policy-management/policy-management.component";
import { PolicyTypeManagementComponent } from "./components/policy-type-management/policy-type-management.component";
import { ProvinceManagementComponent } from "./components/province-management/province-management.component";
import { PreferredLanguagesManagementComponent } from "./components/preferred-languages-management/preferred-languages-management.component";
import { MaritalStatusManagementComponent } from "./components/marital-status-management/marital-status-management.component";
import { QualificationsManagementComponent } from "./components/qualifications-management/qualifications-management.component";


@Component({
  selector: 'app-data-management',
  imports: [ TabsModule, CommonModule, BadgeModule, AvatarModule, PolicyManagementComponent, PolicyTypeManagementComponent, ProvinceManagementComponent, PreferredLanguagesManagementComponent, MaritalStatusManagementComponent, QualificationsManagementComponent],
  templateUrl: './data-management.component.html',
  styleUrl: './data-management.component.scss'
})
export class DataManagementComponent {

}
