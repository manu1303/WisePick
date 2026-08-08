export interface Company {

  id?: string;

  name: string;

  industry: string;

  city: string;

  country: string;

  employees: string;

  categories: string[];

  dailySalesRange: string;

  salesRecordMethod: string;

  salesChannels: string[];

  objectives: string[];

  preferredDataSource: string;

  createdAt?: string;

  updatedAt?: string;

}