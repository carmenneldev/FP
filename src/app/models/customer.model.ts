import { FinancialAdvisor } from './financial-advisor.model';
import { Province } from './province.model';
import { MaritalStatus } from './marital-status.model';
import { PreferredLanguage } from './preferred-language.model';
import { Qualification } from './qualification.model';
import { Policy } from './policy.model';
import { Budget } from './budget.model';

export interface Customer {
  id: number;
  financialAdvisorID: number;
  firstName: string;
  surname: string;
  identityNumber: string;
  employer: string;
  mobileNumber: string;
  maritalStatusID: number;
  emailAddress: string;
  physicalAddress1: string;
  physicalAddress2: string;
  provinceID: number;
  postalCode: string;
  preferredLanguageID: number;
  qualificationID: number;
  financialAdvisor?: FinancialAdvisor;
  province?: Province;
  maritalStatus?: MaritalStatus;
  preferredLanguage?: PreferredLanguage;
  qualification?: Qualification;
  policies?: Policy[];
  budgets?: Budget[];
}