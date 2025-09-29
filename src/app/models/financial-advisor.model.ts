import { Province } from './province.model';
import { Customer } from './customer.model';

export interface FinancialAdvisor {
  id: number;
  firstName: string;
  surname: string;
  identityNumber: string;
  mobileNumber: string;
  emailAddress: string;
  physicalAddress1: string;
  physicalAddress2?: string;
  provinceID: number;
  postalCode: string;
  fsca_Number: string;
  province?: Province;
  customers?: Customer[];
}