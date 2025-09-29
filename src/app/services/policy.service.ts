import { Injectable } from '@angular/core';
import { Policy } from '../models/policy.model';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private apiUrl = `${environment.apiUrl}/Policy`;
  private policies: Policy[] = [];
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl);
  }

  getById(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`);
  }

  create(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(this.apiUrl, policy);
  }

  update(policy: Policy): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${policy.id}`, policy);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByCustomerId(customerId: number): Observable<Policy[]> {
    return this.getAll().pipe(
      map(policies => policies.filter(policy => policy.customerID === customerId))
    );
  }
}