import { Injectable } from '@angular/core';
import { FinancialAdvisor } from '../models/financial-advisor.model';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FinancialAdvisorService {
  private apiUrl = `${environment.apiUrl}/FinancialAdvisor`;
  private financialAdvisors: FinancialAdvisor[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<FinancialAdvisor[]> {
    return this.http.get<FinancialAdvisor[]>(this.apiUrl);
  }

  getById(id: number): Observable<FinancialAdvisor> {
    return this.http.get<FinancialAdvisor>(`${this.apiUrl}/${id}`);
  }

  create(advisor: FinancialAdvisor): Observable<FinancialAdvisor> {
    return this.http.post<FinancialAdvisor>(this.apiUrl, advisor);
  }

  update(advisor: FinancialAdvisor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${advisor.id}`, advisor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}