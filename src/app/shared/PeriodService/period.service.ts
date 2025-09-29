import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private selectedPeriodSubject = new BehaviorSubject<string>('12');
  selectedPeriod$ = this.selectedPeriodSubject.asObservable();

  setSelectedPeriod(period: string) {
    this.selectedPeriodSubject.next(period);
  }
}
