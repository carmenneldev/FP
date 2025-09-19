import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../models/customer.model'; // adjust path if needed

@Injectable({ providedIn: 'root' })
export class ClientStateService {
  private selectedId = new BehaviorSubject<number | null>(null);
  selectedId$ = this.selectedId.asObservable();

  private bankDataSubject = new BehaviorSubject<any>(null);
  bankData$ = this.bankDataSubject.asObservable();

  setSelectedId(id: number) {
    this.selectedId.next(id);
  }

  getSelectedId(): number | null {
    return this.selectedId.value;
  }

    
// Helper method to set bank data
  setBankData(data: { labels: string[], moneyIn: number[], moneyOut: number[] }) {
    this.bankDataSubject.next(data);
  }
}

