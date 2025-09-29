import { Component, OnInit } from '@angular/core';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { CommonModule } from '@angular/common';
import {UserContextService} from '../../shared/user-context/user-context.service';

import { StatementGraphComponent } from "../statement-graph/statement-graph.component";
import { PeriodService } from '../../shared/PeriodService/period.service';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-client-overview',
  standalone: true,
  imports: [ContactFormComponent, CommonModule, StatementGraphComponent, TableModule],
  templateUrl: './client-overview.component.html',
  styleUrls: ['./client-overview.component.scss']
})

export class ClientOverviewComponent implements OnInit {
  policiesData = {
    short: [
      {
        policyName: 'Short Term Life',
        underwritten: 'Yes',
        policyType: { name: 'Life' },
        customer: { fullName: 'John Doe' },
        value: 2500000,
        policyInitiationDate: new Date('2023-01-01'),
        policyExpirationDate: new Date('2024-01-01'),
      },
    ],
    long: [
      {
        policyName: 'Long Term Disability',
        underwritten: 'No',
        policyType: { name: 'Disability' },
        customer: { fullName: 'Jane Smith' },
        value: 3500000,
        policyInitiationDate: new Date('2022-05-15'),
        policyExpirationDate: new Date('2030-05-15'),
      },
    ]
  };

  showContactForm = false;
  username: string = '';
  displayContactForm: any;
  selectedPeriod: string = '12';

  shortTermPolicies = this.policiesData.short;
  longTermPolicies = this.policiesData.long;


  // Set default policy type and load corresponding policies
  selectedPolicyType: 'short' | 'long' = 'short';
  policies: any[] = this.policiesData['short'];
  showPolicyPopup: boolean = false;

  constructor(
    private userContext: UserContextService,
    private periodService: PeriodService
  ) {}

  ngOnInit() {
    this.username = this.userContext.userName;

    this.periodService.selectedPeriod$.subscribe(period => {
      this.selectedPeriod = period;
    });
  }

  openContactForm() {
    this.displayContactForm = true;
  }

  closeContactForm() {
    this.displayContactForm = false;
  }

  handleSubmit(formData: any) {
    console.log('Contact form submitted:', formData);
  }

  switchPolicy(type: 'short' | 'long') {
    this.selectedPolicyType = type;
    this.policies = this.policiesData[type];
  }

  openPolicy(type: 'short' | 'long') {
  this.selectedPolicyType = type;
  this.policies = this.policiesData[type];
  this.showPolicyPopup = true;
}


}

