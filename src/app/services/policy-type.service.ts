import { Injectable } from '@angular/core';
import { PolicyType } from '../models/policy-type.model';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PolicyTypeService {
  private apiUrl = `${environment.apiUrl}/PolicyType`;
  private policyTypes: PolicyType[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<PolicyType[]> {
    return this.http.get<PolicyType[]>(this.apiUrl);
  }

  getById(id: number): Observable<PolicyType> {
    return this.http.get<PolicyType>(`${this.apiUrl}/${id}`);
  }

  create(policyType: PolicyType): Observable<PolicyType> {
    return this.http.post<PolicyType>(this.apiUrl, policyType);
  }

  update(policyType: PolicyType): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${policyType.id}`, policyType);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}