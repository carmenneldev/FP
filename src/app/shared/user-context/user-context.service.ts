import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserContextService {
  username: string = '';

  set userName(name: string) {
    this.username = name;
  }

  get userName(): string {
    return this.username;
  }
}
