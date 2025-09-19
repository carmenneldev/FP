import { Injectable } from '@angular/core';
import { Qualification } from '../models/qualification.model';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private apiUrl = `${environment.apiUrl}/Qualification`;
  private qualifications: Qualification[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Qualification[]> {
    return this.http.get<Qualification[]>(this.apiUrl);
  }

  getById(id: number): Observable<Qualification> {
    return this.http.get<Qualification>(`${this.apiUrl}/${id}`);
  }

  create(qualification: Qualification): Observable<Qualification> {
    return this.http.post<Qualification>(this.apiUrl, qualification);
  }

  update(qualification: Qualification): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${qualification.id}`, qualification);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}