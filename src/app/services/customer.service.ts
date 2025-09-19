import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers: Customer[] = [];

  getCustomers(): Customer[] {
    return this.customers;
  }

  addCustomer(customer: Customer): void {
    this.customers.push(customer);
  }
}