import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientFormHelper } from '../../shared/client-form.helper';
import { AddClientFormComponent } from "../client-onboarding/client-onboarding.component";
import { CalendarModule } from 'primeng/calendar';
import { FinancialAdvisorService} from '../../services/financial-advisor.service';
// import { UserCredentialService } from '../../services/user-credential.service';
import { FinancialAdvisor } from '../../models/financial-advisor.model';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';


import { ClientService } from '../../services/client.service';
import { Customer } from '../../models/customer.model';
import { UserContextService } from '../../shared/user-context/user-context.service';
import { StatementGraphComponent } from '../statement-graph/statement-graph.component';
import { ChartModule } from 'primeng/chart';
import { DataCleanerHelper } from '../../shared/data-cleaner.helper';
import { Dialog } from "primeng/dialog";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PeriodService } from '../../shared/PeriodService/period.service';
import { Observable } from 'rxjs/internal/Observable';



@Component({
  selector: 'app-agent-dashboard',
  imports: [CommonModule,SplitButtonModule, FormsModule, DropdownModule, AddClientFormComponent, CalendarModule, StatementGraphComponent, ChartModule, Dialog],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})

export class AgentDashboardComponent implements OnInit{
  upArrowIcon = 'assets/Icons/upArrow.png';
  downArrowIcon= 'assets/Icons/downArrow.png';
  proceedIcon = 'assets/Icons/proceedIcon.png';
  addClientIcon = 'assets/Icons/AddIcon.png';


  showAddClientForm = false;
  selectedDate: Date[] | null = null;
  showCalendar: boolean = false;
  displayDateRange: string = '';
  userName: string = '';
  topClients: Customer[] = [];
  selectedPeriod = '12';
  netFlows: { label: string, value: number }[] = [];
  showMessagePopup: boolean = false;
  selectedClientMessage: string = '';
  showPolicies = true;
  currentIndex = 0;
  isDropdownOpen = false;

  clientCount$!: Observable<number>;



  countOptions = [
  { label: 'Show 5', value: 5 },
  { label: 'Show 10', value: 10 },
  { label: 'Show 15', value: 15 }
];

selectedCount = this.countOptions[0]


// use the one from database later , this for a show case for now
policies = [
  { title: 'Life Cover Plan', desc: 'Cover up to R500 000 for 10 years.' },
  { title: 'Health Plan', desc: 'Out‑patient and emergency care.' },
  { title: 'Disability Cover', desc: 'Secure your income in case of disability.' }
];


  monthOptions = [
  { label: '1 Month', value: 1 },
  { label: '3 Months', value: 3 },
  { label: '6 Months', value: 6 },
  { label: '12 Months', value: 12 }
];

 selectedMonth = this.monthOptions[0];


  constructor(private advisorService: FinancialAdvisorService,private clientService: ClientService,
          private userContext: UserContextService,
          public dataCleanerHelper: DataCleanerHelper,
          private periodService: PeriodService,
         
  ) {}

  ngOnInit() {
    const id = localStorage.getItem('advisorId');
    if (id) {
      this.advisorService.getById(+id).subscribe({
        next: (FinancialAdvisor: FinancialAdvisor) => {
          const advisor = this.dataCleanerHelper.stripReferenceProps(FinancialAdvisor);
          this.userName = advisor.firstName;
           this.userContext.username = advisor.firstName; 
        },
        error: err => {
          console.error('Failed to fetch advisor:', err);
        }
      });
    }else{
      this.userName = this.userContext.username;
    }

     this.loadTopClients();

     this.IteratePolicies();

  }

  loadTopClients() {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        const data = this.dataCleanerHelper.stripReferenceProps(clients);
        this.topClients = data.slice(0, 10); // Get top 10 clients
      },
      error: (err) => {
        console.error('Failed to load clients:', err);
      }
    });
  }

  


    get currentPolicy() {
      return this.policies[this.currentIndex];
    }

    IteratePolicies(){
        setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.policies.length;
      }, 3000)
    }

  openAddClientForm() {
    this.showAddClientForm = true;
  }

  closeAddClientForm() {
    this.showAddClientForm = false;
  }


  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  onDateSelect() {
    if (this.selectedDate && this.selectedDate.length === 2) {
      const [start, end] = this.selectedDate;
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      this.displayDateRange = `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
      this.showCalendar = false;
    }
  }

  changePeriod(period: string) {
    this.selectedPeriod = period;
    this.periodService.setSelectedPeriod(period);
  }


    get fallbackDateRange(): string {
      return this.displayDateRange || '01 Jan - 21 Jan, 2024';
    }


    openMessage(client: any): void {
      this.selectedClientMessage = client.message || 'No message available.';
      this.showMessagePopup = true;
    }

}
