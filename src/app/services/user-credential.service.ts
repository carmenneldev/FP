import { Injectable } from '@angular/core';
import { UserCredential } from '../models/user-credential.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserCredential;
}

@Injectable({
  providedIn: 'root',
})
export class UserCredentialService {
  private readonly apiUrl = `${environment.apiUrl}/UserCredential`;

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  getAll(): Observable<UserCredential[]> {
    return this.http.get<UserCredential[]>(this.apiUrl);
  }

  getById(id: number): Observable<UserCredential> {
    return this.http.get<UserCredential>(`${this.apiUrl}/${id}`);
  }

  create(userCredential: UserCredential): Observable<UserCredential> {
    return this.http.post<UserCredential>(this.apiUrl, userCredential);
  }

  update(userCredential: UserCredential): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userCredential.id}`, userCredential);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}