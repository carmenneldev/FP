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
import { Observable, of } from 'rxjs';
import { map, catchError, forkJoin } from 'rxjs';
import { PolicyService } from '../../services/policy.service';



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
  
  // Policy statistics
  activePoliciesCount: number = 0;
  shortTermPoliciesCount: number = 0;
  longTermPoliciesCount: number = 0;
  
  // Current month for "Month to Target"
  currentMonthRange: string = '';



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
          private policyService: PolicyService
         
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
     this.loadPolicyStatistics();
     this.setupClientCount();
     this.setCurrentMonthDefaults();
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

  loadPolicyStatistics() {
    // Get both clients and policies, then filter policies for this advisor's clients only
    forkJoin({
      clients: this.clientService.getAll(),
      policies: this.policyService.getAll()
    }).subscribe({
      next: ({ clients, policies }) => {
        const now = new Date();
        let activeCount = 0;
        let shortTermCount = 0;
        let longTermCount = 0;
        
        // Get client IDs for this advisor
        const clientIds = new Set(clients.map(client => client.id));
        
        // Filter policies to only include those belonging to this advisor's clients
        const advisorPolicies = policies.filter(policy => clientIds.has(policy.customerID));
        
        // Single pass through advisor's policies with proper edge case handling
        advisorPolicies.forEach(p => {
          // Skip policies with missing/invalid dates
          if (!p.policyInitiationDate || !p.policyExpirationDate) return;
          
          const startDate = new Date(p.policyInitiationDate);
          const endDate = new Date(p.policyExpirationDate);
          
          // Skip policies with invalid date ranges
          if (endDate <= startDate) return;
          
          // Count active policies (current date between start and end)
          if (now >= startDate && now <= endDate) {
            activeCount++;
          }
          
          // Calculate term length with day accuracy
          const timeDiff = endDate.getTime() - startDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          const monthsDiff = daysDiff / 30.44; // Average month length
          
          // Classify as short-term (≤12 months) or long-term (>12 months)
          if (monthsDiff <= 12) {
            shortTermCount++;
          } else {
            longTermCount++;
          }
        });
        
        this.activePoliciesCount = activeCount;
        this.shortTermPoliciesCount = shortTermCount;
        this.longTermPoliciesCount = longTermCount;
      },
      error: (err) => {
        console.error('Failed to load policy statistics:', err);
      }
    });
  }

  setupClientCount() {
    this.clientCount$ = this.clientService.getAll().pipe(
      map(clients => clients.length),
      catchError(err => {
        console.error('Failed to load client count:', err);
        return of(0);
      })
    );
  }

  setCurrentMonthDefaults() {
    const now = new Date();
    
    // Set fallback date range to current month
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    this.displayDateRange = `${firstDay.toLocaleDateString('en-GB', options)} - ${lastDay.toLocaleDateString('en-GB', options)}`;
    
    // Set current month range for "Month to Target"
    const dayOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    this.currentMonthRange = `${firstDay.toLocaleDateString('en-GB', dayOptions)} - ${lastDay.toLocaleDateString('en-GB', dayOptions)}`;
    
    // Set month dropdown to default to "1 Month" (since these are duration options, not month names)
    this.selectedMonth = this.monthOptions[0]; // Default to first option: "1 Month"
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
      if (this.displayDateRange) {
        return this.displayDateRange;
      }
      
      // Default to current month if no date range is set
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      
      return `${firstDay.toLocaleDateString('en-GB', options)} - ${lastDay.toLocaleDateString('en-GB', options)}`;
    }


    openMessage(client: any): void {
      this.selectedClientMessage = client.message || 'No message available.';
      this.showMessagePopup = true;
    }

}
