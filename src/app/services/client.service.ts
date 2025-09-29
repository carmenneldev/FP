import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment.dev';


@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/Customer`;

  private clientCountSubject = new BehaviorSubject<number>(0);
  clientCount$ = this.clientCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return new Observable((observer) => {
      this.http.get<Customer[]>(this.apiUrl).subscribe((customers) => {
        // 👇 Update count when data is fetched
        this.clientCountSubject.next(customers.length);
        observer.next(customers);
        observer.complete();
      });
    });
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    return new Observable((observer) => {
      this.http.post<Customer>(this.apiUrl, customer).subscribe((newCustomer) => {
        // Optionally, trigger update again
        this.refreshClientCount();
        observer.next(newCustomer);
        observer.complete();
      });
    });
  }


  update(customer: Customer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${customer.id}`, customer);
  }

  delete(id: number): Observable<void> {
    return new Observable((observer) => {
      this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(() => {
        this.refreshClientCount();
        observer.next();
        observer.complete();
      });
    });
  }

  refreshClientCount(): void {
    this.getAll().subscribe(); // This will trigger count update
  }

  // Statement and transaction related methods
  getTransactionSummary(customerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${customerId}/TransactionSummary`);
  }

  getStatementTransactions(statementId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Statements/${statementId}/Transactions`);
  }

  // Get ALL transactions for a customer (across all statements)
  getCustomerTransactions(customerId: number, options?: {
    categoryId?: number;
    direction?: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
    from?: string;
    to?: string;
  }): Observable<any[]> {
    let params = '';
    if (options) {
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      params = queryParams.toString() ? `?${queryParams.toString()}` : '';
    }
    return this.http.get<any[]>(`${this.apiUrl}/${customerId}/Transactions${params}`);
  }
}
