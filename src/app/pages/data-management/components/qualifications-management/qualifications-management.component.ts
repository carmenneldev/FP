import { Component } from '@angular/core';
import { Toast } from "primeng/toast";
import { TableModule } from "primeng/table";
import { SelectModule } from "primeng/select";
import { QualificationService } from '../../../../services/qualification.service';
import { DataCleanerHelper } from '../../../../shared/data-cleaner.helper';
import { Qualification } from '../../../../models/qualification.model';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qualifications-management',
  imports: [Toast, TableModule, SelectModule, FormsModule, CommonModule],
  providers: [MessageService],
  templateUrl: './qualifications-management.component.html',
  styleUrl: './qualifications-management.component.scss'
})
export class QualificationsManagementComponent {
  clonedProducts: any;
onRowEditCancel(qualification: any,index: number) {
  this.qualifications[index] = this.clonedProducts[qualification.id as string];
  delete this.clonedProducts[qualification.id as string];
}
onRowEditSave(arg0: any) {
throw new Error('Method not implemented.');
}
onRowEditInit(arg0: any) {
throw new Error('Method not implemented.');
}
  qualifications: Qualification[] = [];

  constructor(
    private readonly qualificationService:QualificationService,
    private readonly dataCleanerHelper: DataCleanerHelper
  ) {
    this.loadQualifications();
  }
  loadQualifications() {
    this.qualificationService.getAll().subscribe((qualifications) => {
      this.qualifications = this.dataCleanerHelper.stripReferenceProps(qualifications);
    });
  }

}
