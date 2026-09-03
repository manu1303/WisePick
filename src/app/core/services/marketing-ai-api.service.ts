import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export interface MarketingSummaryApi {

  totalRevenue: number;

  totalSales: number;

  identifiedSales: number;

  identifiedPercentage: number;

  recurringCustomers: number;

  lowStockProducts: number;

}


export interface ProductMetricApi {

  id?: string | null;

  name: string;

  quantity: number;

  revenue: number;

}


export interface MarketingInsightApi {

  id: string;

  type:
    | 'opportunity'
    | 'warning'
    | 'success'
    | 'customer';

  priority:
    | 'high'
    | 'medium'
    | 'low';

  icon: string;

  title: string;

  description: string;

  evidence: string;

  action: string;

  targetType?:
    | 'product'
    | 'customer'
    | 'sales'
    | 'inventory'
    | null;

  targetId?:
    string | null;

  targetName?:
    string | null;

}


export interface MarketingAnalysisApi {

  summary:
    MarketingSummaryApi;

  bestProduct:
    ProductMetricApi | null;

  insights:
    MarketingInsightApi[];

}


@Injectable({
  providedIn:
    'root'
})
export class MarketingAiApiService {


  private readonly apiUrl =
    'http://localhost:8086/api/marketing-ai';


  constructor(
    private http:
      HttpClient
  ) {}


  getInsights():
    Observable<MarketingAnalysisApi> {

    return this.http.get<
      MarketingAnalysisApi
    >(
      `${this.apiUrl}/insights`
    );

  }

}