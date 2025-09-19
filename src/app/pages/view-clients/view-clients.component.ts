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
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { Menu } from 'primeng/menu';
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
    FloatLabel, ReactiveFormsModule,
    Message, DatePicker
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
  activeStatusClientId: number | null = null;
  activeUploadClientId: number | null = null;

  displayUploadDialog: boolean = false;
  totalSize: number = 0;
  totalSizePercent: number = 0;

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
        this.customers = customers.filter((client: { financialAdvisorID: number; }) => client.financialAdvisorID === advisorId);
        this.filteredList = this.customers;
        console.log(`Filtered Customer`, this.filteredList);
        console.log(`Customers`, customers)

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

  showMenuForClient(event: MouseEvent, client: Customer, menu: Menu) {
  if (this.openMenuClientId === client.id) {
    // Close if same menu clicked again
    menu.hide();
    this.openMenuClientId = null;
  } else {
    this.openMenuClientId = client.id;
    this.selectedClient = client;
    this.menuItems = [
      { label: 'Edit', icon: 'pi pi-pencil',command: () => this.onEditClient(client) },
      {
        label : 'Policy Management', icon: 'pi pi-book', command: () => this.onPolicyManagement(client)
      },
      { label: 'Upload', icon: 'pi pi-upload',
        command: () => {
          this.displayUploadDialog = true;
          this.openMenuClientId = null;
        }
       },
      { label: 'Status', icon: 'pi pi-info' ,command: () => this.onChangeStatus(client) }
    ];
    menu.show(event);
  }
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
  getStatusClass(status: string | null): string {
    switch ((status || 'active').toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'onhold':
        return 'status-onhold';
      default:
        return 'status-default';
    }
  }

  // policy section
  loadPolicies() {
    this.policyService.getAll().subscribe((res) => {
      this.policies = res;
    });
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
  
}
