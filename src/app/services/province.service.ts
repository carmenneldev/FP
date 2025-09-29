import { Injectable } from '@angular/core';
import { Province } from '../models/province.model';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  private apiUrl = `${environment.apiUrl}/Province`;
  private provinces: Province[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Province[]> {
    return this.http.get<Province[]>(this.apiUrl);
  }

  getById(id: number): Observable<Province> {
    return this.http.get<Province>(`${this.apiUrl}/${id}`);
  }

  create(province: Province): Observable<Province> {
    return this.http.post<Province>(this.apiUrl, province);
  }

  update(province: Province): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${province.id}`, province);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}