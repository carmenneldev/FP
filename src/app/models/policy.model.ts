import { Customer } from "./customer.model";
import { PolicyType } from './policy-type.model';

export interface Policy {
  id: number;
  customerID: number;
  policyName: string;
  underwritten: string;
  policyTypeID: number;
  value: number;
  policyInitiationDate: string; // ISO string
  policyExpirationDate: string; // ISO string
  customer?: Customer;
  policyType?: PolicyType;
}