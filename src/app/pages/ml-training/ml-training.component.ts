import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  categoryId: number | null;
  categoryName: string | null;
  confidence: number;
  selected?: boolean;
}

interface Category {
  id: number;
  name: string;
  directionConstraint: string | null;
  color: string;
  label?: string;
  value?: number;
}

@Component({
  selector: 'app-ml-training',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './ml-training.component.html',
  styleUrl: './ml-training.component.scss'
})
export class MlTrainingComponent implements OnInit {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  transactions: Transaction[] = [];
  categories: Category[] = [];
  loading = false;
  selectedCategory: any = null;
  
  confidenceThreshold = 0.5;
  searchText = '';

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${environment.apiUrl}/TransactionCategory`)
      .subscribe({
        next: (categories) => {
          this.categories = categories.map(cat => ({
            ...cat,
            label: cat.name,
            value: cat.id
          }));
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load categories'
          });
        }
      });
  }

  loadTransactions(): void {
    this.loading = true;
    
    this.http.get<any[]>(`${environment.apiUrl}/BankTransaction/uncategorized`, {
      params: { confidenceThreshold: this.confidenceThreshold.toString() }
    }).subscribe({
      next: (data) => {
        this.transactions = data.map(txn => ({
          id: txn.id,
          date: txn.txnDate,
          description: txn.description,
          amount: txn.amount,
          categoryId: txn.categoryId,
          categoryName: txn.categoryName,
          confidence: txn.confidence || 0,
          selected: false
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load transactions'
        });
        this.loading = false;
      }
    });
  }

  updateCategory(transaction: Transaction, category: any): void {
    if (!category) return;

    this.http.put(`${environment.apiUrl}/BankTransaction/${transaction.id}/category`, {
      categoryId: category.value,
      confidence: 1.0
    }).subscribe({
      next: () => {
        transaction.categoryId = category.value;
        transaction.categoryName = category.label;
        transaction.confidence = 1.0;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Transaction categorized as ${category.label}`
        });
      },
      error: (err) => {
        console.error('Error updating category:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update category'
        });
      }
    });
  }

  bulkUpdateCategory(): void {
    if (!this.selectedCategory) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a category first'
      });
      return;
    }

    const selectedTransactions = this.transactions.filter(t => t.selected);
    if (selectedTransactions.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one transaction'
      });
      return;
    }

    const updates = selectedTransactions.map(txn => 
      this.http.put(`${environment.apiUrl}/BankTransaction/${txn.id}/category`, {
        categoryId: this.selectedCategory.value,
        confidence: 1.0
      }).toPromise()
    );

    Promise.all(updates).then(() => {
      selectedTransactions.forEach(txn => {
        txn.categoryId = this.selectedCategory.value;
        txn.categoryName = this.selectedCategory.label;
        txn.confidence = 1.0;
        txn.selected = false;
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${selectedTransactions.length} transactions updated`
      });
      this.selectedCategory = null;
    }).catch(err => {
      console.error('Error bulk updating:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update some transactions'
      });
    });
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.5) return 'warning';
    return 'danger';
  }

  getCategoryOptions(transaction: Transaction): any[] {
    const direction = transaction.amount >= 0 ? 'in' : 'out';
    return this.categories.filter(cat => 
      !cat.directionConstraint || cat.directionConstraint === direction
    );
  }

  get filteredTransactions(): Transaction[] {
    if (!this.searchText) return this.transactions;
    
    const search = this.searchText.toLowerCase();
    return this.transactions.filter(txn => 
      txn.description.toLowerCase().includes(search) ||
      (txn.categoryName && txn.categoryName.toLowerCase().includes(search))
    );
  }

  get selectedCount(): number {
    return this.transactions.filter(t => t.selected).length;
  }

  refreshData(): void {
    this.loadTransactions();
  }
}
