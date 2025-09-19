import { Injectable } from '@angular/core';
import { BudgetExpenseCategory } from '../models/budget-expense-category.model';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BudgetExpenseCategoryService {
  private apiUrl = `${environment.apiUrl}/BudgetExpenseCategory`;
  private categories: BudgetExpenseCategory[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<BudgetExpenseCategory[]> {
    return this.http.get<BudgetExpenseCategory[]>(this.apiUrl);
  }

  getById(id: number): Observable<BudgetExpenseCategory> {
    return this.http.get<BudgetExpenseCategory>(`${this.apiUrl}/${id}`);
  }

  create(category: BudgetExpenseCategory): Observable<BudgetExpenseCategory> {
    return this.http.post<BudgetExpenseCategory>(this.apiUrl, category);
  }

  update(category: BudgetExpenseCategory): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${category.id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}