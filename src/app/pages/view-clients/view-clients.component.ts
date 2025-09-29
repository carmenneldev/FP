import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Menu } from 'primeng/menu';
import { OverlayPanel } from 'primeng/overlaypanel';
import { BadgeModule, Badge } from 'primeng/badge';
import { ClientService } from '../../services/client.service';
import { ClientStateService } from '../../services/client-state.service';
import { DataCleanerHelper } from '../../shared/data-cleaner.helper';
import { Customer } from '../../models/customer.model';
import { AddClientFormComponent } from '../client-onboarding/client-onboarding.component';
import { FloatLabel } from "primeng/floatlabel";
import { Policy } from '../../models/policy.model';
import { ReactiveFormsModule } from '@angular/forms';
import { PolicyType } from '../../models/policy-type.model';
import { PolicyService } from '../../services/policy.service';
import { CustomerService } from '../../services/customer.service';
import { PolicyTypeService } from '../../services/policy-type.service';
import { Message } from "primeng/message";
import { MaritalStatusService } from '../../services/marital-status.service';
import { PreferredLanguageService } from '../../services/preferred-language.service';
import { QualificationService } from '../../services/qualification.service';
import { ProvinceService } from '../../services/province.service';
import { DatePicker } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { environment } from '../../../environments/environment.dev';


@Component({
  selector: 'app-view-clients',
  standalone: true,
  imports: [
    HttpClientModule,
    CheckboxModule,
    ProgressBarModule,
    RouterLink,
    TableModule,
    MenuModule,
    OverlayPanelModule,
    DialogModule,
    RippleModule,
    SelectModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUploadModule,
    DropdownModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    FormsModule,
    InputNumberModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    AddClientFormComponent,
    Badge,
    ProgressSpinnerModule,
    FloatLabel, ReactiveFormsModule,
    Message, DatePicker, ChartModule
],
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss'],
  providers: [ConfirmationService, MessageService, BadgeModule],
})
export class ViewClientsComponent implements OnInit {
  searchText = '';
  clientDialog = false;
  isSaving = false;
  showClientForm = false;
  customers: Customer[] = [];
  filteredList: Customer[] = [];
  selectedCustomer: Customer | null = null;
  editingClient: Customer | null = null;
  selectedClient: Customer | null = null;
  menuItems: MenuItem[] = [];
  currentPage = 1;
  rowsPerPage = 10;
  // showDropdown = false;
  activeEditClientId: number | null = null;
  openMenuClientId: number | null = null;
  menuPosition = { x: 0, y: 0 };

  // Menu is now handled directly in the template per row
  activeStatusClientId: number | null = null;
  activeUploadClientId: number | null = null;

  displayUploadDialog: boolean = false;
  totalSize: number = 0;
  totalSizePercent: number = 0;
  
  // Bank statement upload properties
  uploadInProgress = false;
  uploadStatus: string | null = null;
  uploadResult: any = null;
  uploadError: string | null = null;
  files: File[] = [];
  selectedFile: File | null = null;
  
  // Policy dialog properties
  showPoliciesForClient: boolean = false;

    provinces: any[]|undefined;
  maritalStatuses: any[]|undefined;
  languages: any[]|undefined;
  qualifications: any[]|undefined;

  statusDialogVisible: boolean = false;
  statusOptions: any[] = [
    { id : 1, description: 'Active' },
    { id : 2, description: 'Inactive' },
    { id : 3, description: 'On Hold' }
  ];
  selectedStatus: string = '';
  statusClient: Customer | null = null;
  editClientDialogVisible = false;

  isDropdownOpen:boolean = false;
  sortDirection: 'asc' | 'desc' = 'desc'; 
 
  // create the form
  clientForm : FormGroup = new FormGroup({
    
  });

  policyForm!: FormGroup;
  policies: Policy[] = [];
  allPolicies: Policy[] = []; // For main dashboard display
  clientPolicies: Policy[] = []; // For client-specific dashboard
  policyTypes: PolicyType[] = [
    {
      id: 1,
      description: 'Long Term'
    },
    {
      id: 2,
      description: 'Short Term'
    }
  ];
  policyDialogVisible = false;

 

  imagePath = 'assets/images/Logo_Company.png';
  userProfile = 'assets/images/user-profileImage.png';
  notificationIcon = 'assets/Icons/bellIcon.png';
  addIcon = 'assets/Icons/AddIcon.png';
  dropdownIcon = 'assets/Icons/dropdownIcon.png';
  searchIcon = 'assets/Icons/searchIcon.png';
  greateThanIcon = 'assets/Icons/greaterThan.png';
  lessThanIcon = 'assets/Icons/lessThan.png';
  close: any = true;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private clientService: ClientService,
    private router: Router,
    private clientStateService: ClientStateService,
    private readonly dataCleanerHelper: DataCleanerHelper,
     private fb: FormBuilder,
    private policyService: PolicyService,
    private customerService: CustomerService,
    private policyTypeService: PolicyTypeService,
    private readonly maritalStatusService:MaritalStatusService,
        private readonly prefereredLanguageService:PreferredLanguageService , 
        private readonly qualificationService:QualificationService,
        private readonly provinceService: ProvinceService,
  ) {}


  ngOnInit() {
    this.loadCustomers();
    this.loadAllPolicies(); // Load all policies for dashboard display
       this.provinceService.getAll().subscribe((provinces) => {
      this.provinces = this.dataCleanerHelper.stripReferenceProps(provinces);
    });
    this.maritalStatusService.getAll().subscribe((statuses) => {
      this.maritalStatuses = this.dataCleanerHelper.stripReferenceProps(statuses);
    });
    this.prefereredLanguageService.getAll().subscribe((languages) => {
      this.languages = this.dataCleanerHelper.stripReferenceProps(languages);
    });
    this.qualificationService.getAll().subscribe((qualifications) => {
      this.qualifications = this.dataCleanerHelper.stripReferenceProps(qualifications);
    });

    // form for update

     this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      identityNumber: ['', [Validators.required]], // Add custom SA ID validator if needed
      employer: [''],
      mobileNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      physicalAddress1: [null, Validators.required],
      physicalAddress2: [''],
      postalCode: [null, Validators.required],
      provinceID: [1, Validators.required],
      maritalStatusID: [2, Validators.required],
      preferredLanguageID: [null, Validators.required],
      qualificationID: [null, Validators.required]
    });











    this.policyForm = this.fb.group({
    policyName: ['', Validators.required],
    policyNumber: [''],  // Auto-generated, but user can edit
    underwritten: ['', Validators.required],
    policyTypeID: [null, Validators.required],
    customerID: [null, Validators.required],
    value: [null, Validators.required],
    policyInitiationDate: ['', Validators.required],
    policyExpirationDate: ['', Validators.required],
  });


  }

  loadCustomers() {
    this.clientService.getAll().subscribe({
      next: (response) => {
        const customers = this.dataCleanerHelper.stripReferenceProps(response);
        const advisorId = parseInt(localStorage.getItem('advisorId') || '0', 10);
        
        // Handle both camelCase and snake_case property names  
        this.customers = customers.filter((client: any) => {
          const clientAdvisorId = client.financialAdvisorID || client.financial_advisor_id;
          return clientAdvisorId === advisorId;
        });
        
        this.filteredList = this.customers;
      },
      error: (error) => console.error('Error fetching clients:', error),
    });
  }


  get paginatedCustomers() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredList.length
      ? this.filteredList.slice(start, end)
      : this.customers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil((this.filteredList.length || this.customers.length) / this.rowsPerPage);
  }

  get startRecord(): number {
    return (this.currentPage - 1) * this.rowsPerPage;
  }

  get endRecord(): number {
    const length = this.filteredList.length || this.customers.length;
    return Math.min(this.startRecord + this.rowsPerPage, length);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this. isDropdownOpen;
  }

  sortAsc() {
    const listToSort = this.filteredList.length ? this.filteredList : this.customers;
    listToSort.sort((a, b) => a.firstName.localeCompare(b.firstName));
    this.isDropdownOpen = false;
  }

  sortDesc() {
    const listToSort = this.filteredList.length ? this.filteredList : this.customers;
    listToSort.sort((a, b) => b.firstName.localeCompare(a.firstName));
    this.isDropdownOpen = false;
  }

  onSearch(): void {
    const term = this.searchText.toLowerCase().trim();
    this.filteredList = term
      ? this.customers.filter((client) => client.firstName.toLowerCase().includes(term))
      : this.customers;
  }

  // add fields 
  onEditClient(client: Customer) {
    this.activeEditClientId = client.id;
    this.editingClient = { ...client }; 

    // debug
    console.log(client);
    console.log(this.clientForm);


    this.clientForm.patchValue({
    firstName: client.firstName,
    surname: client.surname,
    identityNumber: client.identityNumber,
    employer: client.employer,
    mobileNumber: client.mobileNumber,
    emailAddress: client.emailAddress,
    physicalAddress1: client.physicalAddress1,
    physicalAddress2: client.physicalAddress2,
    postalCode: client.postalCode,
    provinceID: client.provinceID,
    maritalStatusID: client.maritalStatusID,
    preferredLanguageID: client.preferredLanguageID,
    qualificationID: client.qualificationID
  });




    this.editClientDialogVisible = true;
  }

  onPolicyManagement(client: Customer){
 
    this.policyDialogVisible = true;
    this.policyForm.reset();
    this.policyForm.patchValue({ customerID: client.id });
    this.selectedClient = client;  // track for filtering and UI
    this.loadPoliciesForClient(client.id);
  }

  loadPoliciesForClient(clientId: number) {
  this.policyService.getByCustomerId(clientId).subscribe((res) => {
    this.policies = res;
  });
}


  


  cancelEdit() {
    this.editingClient = null;
  }

  saveEdit(client: Customer): void {
    this.isSaving = true;
    this.clientService.update(client).subscribe({
      next: () => {
        this.isSaving = false;
        this.editingClient = null;
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Update failed:', err);
      },
    });
  }

  toggleClientMenu(event: MouseEvent, client: Customer) {
    console.log('Menu clicked for client:', client.firstName, 'Client ID:', client.id);
    console.log('Current openMenuClientId:', this.openMenuClientId);
    event.stopPropagation();
    
    if (this.openMenuClientId === client.id) {
      // Close if same menu clicked again
      console.log('Closing menu');
      this.openMenuClientId = null;
    } else {
      console.log('Opening menu for client ID:', client.id);
      this.openMenuClientId = client.id;
      this.selectedClient = client;
      
      // Position menu near the clicked button
      this.menuPosition.x = event.clientX - 150; // Offset to the left of cursor
      this.menuPosition.y = event.clientY + 5;  // Slightly below cursor
      
      console.log('Menu position set to:', this.menuPosition);
    }
    
    console.log('New openMenuClientId:', this.openMenuClientId);
  }

  onSelectionChange(client: Customer | Customer[] | undefined) {
    if (!client) return;
    const selected = Array.isArray(client) ? client[0] : client;
    this.clientStateService.setSelectedId(selected.id);
    this.router.navigate(['/home/clientOverview', selected.id]);
  }

  handleFileUpload(event: Event, client: Customer) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsedData = this.parseBankData(text);
      this.clientStateService.setBankData(parsedData);
    };
    reader.readAsText(file);
  }

  parseBankData(csvText: string): {
    labels: string[];
    moneyIn: number[];
    moneyOut: number[];
  } {
    const lines = csvText.split('\n').filter((line) => line.trim() !== '');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const moneyInPerMonth = new Array(12).fill(0);
    const moneyOutPerMonth = new Array(12).fill(0);

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (cols.length < 4) continue;

      const [dateStr, , type, amountStr] = cols;
      const date = new Date(dateStr.trim());
      const amount = parseFloat(amountStr);

      if (isNaN(date.getTime()) || isNaN(amount)) continue;

      const month = date.getMonth();
      if (type.trim().toLowerCase() === 'moneyin') {
        moneyInPerMonth[month] += amount;
      } else if (type.trim().toLowerCase() === 'moneyout') {
        moneyOutPerMonth[month] += amount;
      }
    }

    return {
      labels: months,
      moneyIn: moneyInPerMonth,
      moneyOut: moneyOutPerMonth,
    };
  }

getDateOfBirthFromId(idNumber: string): string {
        if (!idNumber || idNumber.length < 6) return 'N/A';
        const year = idNumber.substring(0, 2);
        const month = idNumber.substring(2, 4);
        const day = idNumber.substring(4, 6);
        // Assume 1900-1999 for years >= 00 and <= 99 (you can improve this logic if needed)
        const fullYear = parseInt(year, 10) > 30 ? '19' + year : '20' + year;
        return `${fullYear}-${month}-${day}`;
      }


  getGenderFromId(idNumber: string): string {
      if (!idNumber || idNumber.length < 10) return 'N/A';
      const genderDigits = parseInt(idNumber.substring(6, 10), 10);
      return genderDigits < 5000 ? 'Female' : 'Male';
    }

      
  toggleStatusSection(clientId: number) {
      this.activeStatusClientId = this.activeStatusClientId === clientId ? null : clientId;
      this.activeEditClientId = null;
      this.activeUploadClientId = null;
    }


    onTemplatedUpload(event: any) {
      const files: File[] = event.files;
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file, file.name);
      });

      const apiUrl = 'http://localhost:5000/';
  
      // Upload files
      this.http.post(`${apiUrl}/_store/upload_ad_file`, formData).subscribe({
        next: (res: any) => {
          this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Files Uploaded' });
          event.options.clear(); // clear files from UI
  
          // Example: Use deleteFile and updateFile after upload
          if (res && res.fileIds && res.fileIds.length > 0) {
            // Delete the first file (example)
            this.deleteFile(res.fileIds[0], apiUrl).subscribe({
              next: () => {
              },
              error: () => {
                this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: 'Could not delete file' });
              }
            });
  
            // Update the second file (example)
            if (res.fileIds.length > 1) {
              this.updateFile(res.fileIds[1], { name: 'updatedName.pdf' }, apiUrl).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'File updated after upload' });
                },





                error: () => {
                  this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'Could not update file' });
                }
              });
            }
          }
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong Uploading the files' });
        }
      });
  
      this.displayUploadDialog = false; // auto-close on upload
    }

    // Helper methods
deleteFile(fileId: string, apiUrl: string) {
  return this.http.delete(`${apiUrl}/store/upload_ad_file/${fileId}`);
}

updateFile(fileId: string, payload: any, apiUrl: string) {
  return this.http.put(`${apiUrl}/store/upload_ad_file/${fileId}`, payload);
}

onSelectedFiles(event: any) {
  this.totalSize = this.calculateTotalSize(event.files);
  this.totalSizePercent = Math.min((this.totalSize / 1000000) * 100, 100); 
}

calculateTotalSize(files: any[]): number {
  return files.reduce((acc, file) => acc + file.size, 0);
}

formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
onRemoveTemplatingFile(event: Event, file: any, callback: Function, index: number): void {
  event.preventDefault();
  callback(index);
  this.totalSize -= file.size;
  this.totalSizePercent = Math.min((this.totalSize / 1000000) * 100, 100);
}


// dont forget to update the status 
  onChangeStatus(client: Customer) {
    this.statusClient = client;
    this.selectedStatus = client.maritalStatus?.status || 'active';
    this.statusDialogVisible = true;
  }

  confirmStatusUpdate() {
  if (this.statusClient) {
    this.statusClient.firstName  = this.selectedStatus;
    this.clientService.update(this.statusClient).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Status updated' });
        this.statusDialogVisible = false;
        this.statusClient = null;
      },
      error: (err) => {
        console.error('Failed to update status:', err);
        this.messageService.add({ severity: 'error', summary: 'Status update failed' });
      }
    });
  }
}

saveClientEdits() {
  if (!this.editingClient) return;

  this.editingClient = {
    ...this.clientForm.value,
    id: this.editingClient.id,
    financialAdvisorID: this.editingClient.financialAdvisorID
  };


  this.clientService.update(this.editingClient as Customer).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Client updated' });
      this.editClientDialogVisible = false;
      this.loadCustomers(); 
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Update failed' });
      console.error(err);
    }
  });
}

// this when you select from the dropdown
  getStatusClass(status: string | boolean | null): string {
    if (typeof status === 'boolean') {
      return status ? 'status-active' : 'status-inactive';
    }
    
    // Handle upload statuses
    if (typeof status === 'string') {
      switch (status) {
        case 'Completed':
          return 'text-success';
        case 'Processing...':
          return 'text-info';
        case 'Uploading...':
          return 'text-warning';
        case 'active':
          return 'status-active';
        case 'inactive':
          return 'status-inactive';
        case 'onhold':
          return 'status-onhold';
        default:
          if (status.toLowerCase) {
            switch (status.toLowerCase()) {
              case 'active':
                return 'status-active';
              case 'inactive':
                return 'status-inactive';
              case 'onhold':
                return 'status-onhold';
              default:
                return 'text-muted';
            }
          }
          return 'text-muted';
      }
    }
    
    return 'status-default';
  }

  // policy section
  loadPolicies() {
    this.policyService.getAll().subscribe((res) => {
      this.policies = res;
    });
  }

  loadAllPolicies() {
    this.policyService.getAll().subscribe((res) => {
      this.allPolicies = res;
    });
  }

  getPolicyTypeName(policyTypeID: number): string {
    const type = this.policyTypes.find(t => t.id === policyTypeID);
    return type ? type.description : 'Unknown';
  }

  formatCurrency(amount: string | number): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  openDialog() {
    this.policyDialogVisible = true;
    this.policyForm.reset();
  }

  savePolicy() {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }

    this.policyService.create(this.policyForm.value).subscribe({
      next: () => {
        this.policyDialogVisible = false;
        if (this.selectedClient) {
          this.loadPoliciesForClient(this.selectedClient.id);
        } else {
          this.loadPolicies();
        }
        // Refresh the main dashboard policies list
        this.loadAllPolicies();
      },
      error: (err) => {
        console.error('Error saving policy:', err);
      },
    });
}


isInvalid(controlName: string): boolean {
    const control = this.clientForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  
  // onSubmit() {
  //   if (this.clientForm.invalid) {
  //     this.clientForm.markAllAsTouched();
  //     return;
  //   }

  //   this.isSaving = true;
  //   const advisorId = parseInt(localStorage.getItem('advisorId') || '0', 10);
  //   const payload = ClientFormHelper.toPayload(this.clientForm.value, advisorId);

  //   // Debugging line to check the payload before submission
  //   console.log('Submitting payload:', payload) 

  //   // Call the service to add the client
  //   this.clientService.create(payload).subscribe({
  //     next: () => {
  //       console.log('Client added successfully');
  //       this.isSaving = false;

  //       this.router.navigate(['/home/clients']).then(()=>{
  //         window.location.reload();
  //       });
  //       this.close.emit();

  //     },
  //     error: (err) => {
  //       console.error('Error adding client:', err)
  //       this.isSaving = false;}
  //   });
  // }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.clientForm.patchValue({ bankStatement: file });
    }
  }

  // Bank statement upload methods
  onUploadStatement(client: Customer) {
    console.log('onUploadStatement called with client:', client);
    this.selectedClient = client;
    this.displayUploadDialog = true;
    this.uploadResult = null;
    this.uploadError = null;
    this.uploadStatus = null;
    this.files = [];
    this.selectedFile = null;
    console.log('Upload dialog should now be open:', this.displayUploadDialog);
  }

  // Statement dashboard modal
  showStatementDashboard = false;
  statementDashboardClient: Customer | null = null;

  onViewStatements(client: Customer) {
    console.log('Opening statement dashboard for client:', client.firstName, client.surname);
    this.statementDashboardClient = client;
    this.showStatementDashboard = true;
    this.loadStatementData(client.id);
    this.loadClientPolicies(client.id); // Load client-specific policies
  }

  loadClientPolicies(clientId: number) {
    this.policyService.getByCustomerId(clientId).subscribe({
      next: (policies) => {
        this.clientPolicies = policies;
      },
      error: (error) => {
        console.error('Error loading client policies:', error);
        this.clientPolicies = [];
      }
    });
  }

  onStatementDashboardClose() {
    this.showStatementDashboard = false;
    this.statementDashboardClient = null;
    this.isLoadingStatementData = false;
    this.statementDataError = null;
  }

  // Math reference for template
  Math = Math;

  // Loading states
  isLoadingStatementData = false;
  statementDataError: string | null = null;

  // Pie chart data properties
  pieChartData: any = {};
  pieChartOptions: any = {
    responsive: false,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: R ${(value / 1000).toFixed(1)}k (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (R)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value: any) {
            return 'R' + (value / 1000).toFixed(0) + 'k';
          }
        }
      }
    }
  };


  loadStatementData(clientId: number) {
    this.isLoadingStatementData = true;
    this.statementDataError = null;
    
    // Load both summary and transactions in parallel
    const summaryRequest = this.clientService.getTransactionSummary(clientId);
    const transactionsRequest = this.clientService.getCustomerTransactions(clientId, { 
      size: 100, // Get first 100 transactions
      sort: 'txnDate' 
    });

    // Use Promise.all-like behavior with RxJS
    summaryRequest.subscribe({
      next: (summaryResponse) => {
        console.log('Transaction summary response:', summaryResponse);
        
        // Also load the transactions
        transactionsRequest.subscribe({
          next: (transactionsResponse) => {
            console.log('Transactions response:', transactionsResponse);
            this.processStatementData(summaryResponse, transactionsResponse);
            this.isLoadingStatementData = false;
          },
          error: (error) => {
            console.error('Error loading transactions:', error);
            // Still process summary even if transactions fail
            this.processTransactionSummary(summaryResponse);
            this.isLoadingStatementData = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading transaction summary:', error);
        this.statementDataError = 'Failed to load statement data. Please try again.';
        this.isLoadingStatementData = false;
      }
    });
  }

  // New method that processes both summary and transaction data
  processStatementData(summaryResponse: any, transactionsResponse: any[]) {
    // Process category summary
    this.categorySummary = (summaryResponse.categoryBreakdown || []).map((cat: any, index: number) => ({
      name: cat.categoryName || 'Uncategorized',
      total: Math.abs(cat.total) || 0,
      color: this.getCategoryColor(cat.categoryName, index)
    }));

    // Process transactions - transform API response into template format
    this.extractedTransactions = (transactionsResponse || []).map((txn: any) => ({
      date: new Date(txn.txnDate),
      description: txn.description || 'Transaction',
      amount: parseFloat(txn.amount) || 0,
      category: txn.category?.name || 'Uncategorized',
      categoryColor: this.getCategoryColor(txn.category?.name || 'Uncategorized', 0),
      direction: txn.direction || 'out',
      merchant: txn.merchant,
      balance: parseFloat(txn.balance) || 0
    }));

    // Create pie chart data from category summary
    if (this.categorySummary.length > 0) {
      this.pieChartData = {
        labels: this.categorySummary.map(cat => cat.name),
        datasets: [{
          data: this.categorySummary.map(cat => cat.total),
          backgroundColor: this.categorySummary.map(cat => cat.color),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      };
    } else {
      this.pieChartData = {};
    }

    
    console.log('Processed category summary:', this.categorySummary);
    console.log('Processed extracted transactions:', this.extractedTransactions.length, 'transactions');
    console.log('Pie chart data created:', this.pieChartData);
  }


  // Fallback method for summary-only processing
  processTransactionSummary(response: any) {
    // Transform API response into the format expected by the template
    
    // Transform category breakdown into categorySummary
    this.categorySummary = (response.categoryBreakdown || []).map((cat: any, index: number) => ({
      name: cat.categoryName || 'Uncategorized',
      total: Math.abs(cat.total) || 0,
      color: this.getCategoryColor(cat.categoryName, index)
    }));

    // Keep extractedTransactions empty if we couldn't fetch transactions
    this.extractedTransactions = [];
    
    console.log('Processed category summary only:', this.categorySummary);
  }

  getCategoryColor(categoryName: string, index: number): string {
    // Color mapping for categories - you could fetch this from the API later
    const colorMap: { [key: string]: string } = {
      'Salary': '#8BC34A',
      'Payment Out': '#795548', 
      'Loan Payment': '#3F51B5',
      'Airtime/Mobile': '#9C27B0',
      'Transfer In': '#00BCD4',
      'Shopping': '#4CAF50',
      'Failed Transaction Fee': '#F44336',
      'Bank Fees': '#607D8B',
      'Round-up Savings': '#FF9800'
    };
    
    return colorMap[categoryName] || this.getDefaultColor(index);
  }

  getDefaultColor(index: number): string {
    const defaultColors = ['#2196F3', '#FF5722', '#9E9E9E', '#FFEB3B', '#E91E63', '#00E676'];
    return defaultColors[index % defaultColors.length];
  }

  // Sample data matching the screenshot format
  extractedTransactions = [
    { date: new Date('2020-05-08'), description: 'POS Purchase Chq Card President Hyper Vat 4578667919', amount: -7.00, direction: 'out', category: 'Shopping', categoryColor: '#4CAF50' },
    { date: new Date('2020-05-09'), description: '#Debit Card POS Unsuccessful if #free Declined Purch Tran 4578856043001119', amount: -4.50, direction: 'out', category: 'Failed Transaction Fee', categoryColor: '#F44336' },
    { date: new Date('2020-05-09'), description: 'Bank Your Change Debit 6279835347', amount: -0.79, direction: 'out', category: 'Round-up Savings', categoryColor: '#FF9800' },
    { date: new Date('2020-05-11'), description: 'FNB App Prepaid Airtime 2714433660', amount: -135.00, direction: 'out', category: 'Airtime/Mobile', categoryColor: '#9C27B0' },
    { date: new Date('2020-05-11'), description: 'FNB App Prepaid Airtime 2664324669', amount: -30.00, direction: 'out', category: 'Airtime/Mobile', categoryColor: '#9C27B0' },
    { date: new Date('2020-05-11'), description: 'POS Purchase Chq Card Pay N Zapper 4578667919', amount: -7.00, direction: 'out', category: 'Shopping', categoryColor: '#4CAF50' },
    { date: new Date('2020-05-12'), description: 'POS Purchase Chq Card Mrp Price E-commerce 4578667919', amount: -8.00, direction: 'out', category: 'Shopping', categoryColor: '#4CAF50' },
    { date: new Date('2020-05-12'), description: '#Monthly Account Fee', amount: -4.95, direction: 'out', category: 'Bank Fees', categoryColor: '#607D8B' },
    { date: new Date('2020-05-12'), description: '#Value Added Serv Fees', amount: -0.95, direction: 'out', category: 'Bank Fees', categoryColor: '#607D8B' },
    { date: new Date('2020-05-12'), description: '#Service Fees', amount: -2.00, direction: 'out', category: 'Bank Fees', categoryColor: '#607D8B' },
    { date: new Date('2020-04-30'), description: 'Salary Payment', amount: 6978.00, direction: 'in', category: 'Salary', categoryColor: '#8BC34A' },
    { date: new Date('2020-05-05'), description: 'Payment Out - Loan Installment', amount: -4900.00, direction: 'out', category: 'Payment Out', categoryColor: '#795548' },
    { date: new Date('2020-05-10'), description: 'Loan Payment Received', amount: 1308.00, direction: 'in', category: 'Loan Payment', categoryColor: '#3F51B5' },
    { date: new Date('2020-05-15'), description: 'Transfer In from Savings', amount: 600.00, direction: 'in', category: 'Transfer In', categoryColor: '#00BCD4' }
  ];

  categorySummary = [
    { name: 'Salary', total: 6978.00, color: '#8BC34A' },
    { name: 'Payment Out', total: 4900.00, color: '#795548' },
    { name: 'Loan Payment', total: 1308.00, color: '#3F51B5' },
    { name: 'Airtime/Mobile', total: 165.00, color: '#9C27B0' },
    { name: 'Transfer In', total: 600.00, color: '#00BCD4' },
    { name: 'Shopping', total: 22.00, color: '#4CAF50' },
    { name: 'Failed Transaction Fee', total: 4.50, color: '#F44336' },
    { name: 'Bank Fees', total: 7.90, color: '#607D8B' },
    { name: 'Round-up Savings', total: 0.79, color: '#FF9800' }
  ];

  onUploadDialogClose() {
    this.uploadInProgress = false;
    this.uploadResult = null;
    this.uploadError = null;
    this.uploadStatus = null;
    this.files = [];
  }

  getUploadUrl(): string {
    if (this.selectedClient) {
      return `${environment.apiUrl}/Customer/${this.selectedClient.id}/Statement`;
    }
    return '';
  }

  onFileSelect(event: any) {
    this.files = event.files;
    this.uploadError = null;
    this.uploadResult = null;
  }

  onFileClear() {
    this.files = [];
    this.uploadError = null;
    this.uploadResult = null;
    this.uploadStatus = null;
  }

  onStatementUpload(event: any) {
    this.uploadInProgress = true;
    this.uploadStatus = 'Uploading...';
    this.uploadError = null;

    const formData = new FormData();
    const file = event.files[0];
    formData.append('statement', file);

    // Get auth token
    const token = localStorage.getItem('jwt_token');
    const options = token ? {
      headers: { 'Authorization': `Bearer ${token}` }
    } : {};

    this.http.post(this.getUploadUrl(), formData, options).subscribe({
      next: (response: any) => {
        this.uploadInProgress = false;
        this.uploadStatus = 'Processing...';
        this.uploadResult = response;
        
        // Poll for processing status
        this.pollProcessingStatus(response.statementId);
      },
      error: (error) => {
        this.uploadInProgress = false;
        this.uploadStatus = null;
        this.uploadError = error.error?.error || 'Upload failed. Please try again.';
      }
    });
  }

  pollProcessingStatus(statementId: number) {
    const token = localStorage.getItem('jwt_token');
    const options = token ? {
      headers: { 'Authorization': `Bearer ${token}` }
    } : {};
    
    const pollInterval = setInterval(() => {
      this.http.get(`${environment.apiUrl}/Statements/${statementId}/status`, options)
        .subscribe({
          next: (status: any) => {
            if (status.status === 'completed') {
              this.uploadStatus = 'Completed';
              clearInterval(pollInterval);
            } else if (status.status === 'failed') {
              this.uploadStatus = null;
              this.uploadError = status.error || 'Processing failed';
              clearInterval(pollInterval);
            } else {
              this.uploadStatus = 'Processing...';
            }
          },
          error: (error) => {
            this.uploadStatus = null;
            this.uploadError = 'Failed to check processing status';
            clearInterval(pollInterval);
          }
        });
    }, 2000); // Poll every 2 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (this.uploadStatus === 'Processing...') {
        this.uploadStatus = 'Processing (taking longer than expected)';
      }
    }, 300000);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // New file upload methods
  onFileSelected(event: any) {
    console.log('onFileSelected called with event:', event);
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      this.selectedFile = file;
      this.uploadError = null;
      this.uploadResult = null;
    } else {
      console.log('No file selected');
    }
  }

  clearSelectedFile() {
    console.log('clearSelectedFile called');
    this.selectedFile = null;
    this.uploadError = null;
    this.uploadResult = null;
    this.uploadStatus = null;
  }

  uploadSelectedFile() {
    console.log('uploadSelectedFile called');
    console.log('selectedFile:', this.selectedFile);
    console.log('selectedClient:', this.selectedClient);
    
    if (!this.selectedFile || !this.selectedClient) {
      console.log('Missing file or client, returning');
      this.uploadError = 'Please select a file first';
      return;
    }

    console.log('Starting upload process...');
    this.uploadInProgress = true;
    this.uploadStatus = 'Uploading...';
    this.uploadError = null;

    const formData = new FormData();
    formData.append('statement', this.selectedFile);
    console.log('FormData created with file:', this.selectedFile.name);

    // Get auth token
    const token = localStorage.getItem('jwt_token');
    const uploadUrl = this.getUploadUrl();
    console.log('Upload URL:', uploadUrl);
    console.log('Token exists:', !!token);
    console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    
    const options = token ? {
      headers: { 'Authorization': `Bearer ${token}` }
    } : {};

    console.log('Making HTTP POST request with options:', options);
    this.http.post(uploadUrl, formData, options).subscribe({
      next: (response: any) => {
        console.log('Upload successful:', response);
        this.uploadInProgress = false;
        this.uploadStatus = response.displayName ? `Uploaded as: ${response.displayName}` : 'Processing...';
        this.uploadResult = response;
        
        // Poll for processing status
        this.pollProcessingStatus(response.statementId);
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.uploadInProgress = false;
        this.uploadStatus = null;
        
        // Handle duplicate file (409) vs other errors
        if (error.status === 409) {
          const existingInfo = error.error;
          this.uploadError = `File already uploaded as "${existingInfo.existingDisplayName}" on ${new Date(existingInfo.uploadedAt).toLocaleDateString()}`;
        } else {
          this.uploadError = error.error?.error || 'Upload failed. Please try again.';
        }
      }
    });
  }
  
}
