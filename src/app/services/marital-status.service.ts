import { Injectable } from '@angular/core';
import { MaritalStatus } from '../models/marital-status.model';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaritalStatusService {
  private apiUrl = `${environment.apiUrl}/MaritalStatus`;
  private maritalStatuses: MaritalStatus[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<MaritalStatus[]> {
    return this.http.get<MaritalStatus[]>(this.apiUrl);
  }

  getById(id: number): Observable<MaritalStatus> {
    return this.http.get<MaritalStatus>(`${this.apiUrl}/${id}`);
  }

  create(status: MaritalStatus): Observable<MaritalStatus> {
    return this.http.post<MaritalStatus>(this.apiUrl, status);
  }

  update(status: MaritalStatus): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${status.id}`, status);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}