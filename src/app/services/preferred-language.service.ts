import { Injectable } from '@angular/core';
import { PreferredLanguage } from '../models/preferred-language.model';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreferredLanguageService {
  private apiUrl = `${environment.apiUrl}/PreferredLanguage`;
  private languages: PreferredLanguage[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<PreferredLanguage[]> {
    return this.http.get<PreferredLanguage[]>(this.apiUrl);
  }

  getById(id: number): Observable<PreferredLanguage> {
    return this.http.get<PreferredLanguage>(`${this.apiUrl}/${id}`);
  }

  create(language: PreferredLanguage): Observable<PreferredLanguage> {
    return this.http.post<PreferredLanguage>(this.apiUrl, language);
  }

  update(language: PreferredLanguage): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${language.id}`, language);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}