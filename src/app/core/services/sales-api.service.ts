import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


/* ==========================
   IMPORT RESPONSE
========================== */

export interface SaleImportResponse {

  totalRows: number;

  importedRows: number;

  failedRows: number;

  errors: string[];

}


/* ==========================
   SALE RESPONSE
========================== */

export interface Sale {

  id: string;

  companyId: string;

  saleDate: string;

  customerId?: string | null;

  customerName?: string | null;

  productId?: string | null;

  productName: string;

  quantity: number;

  unitPrice: number;

  total: number;

  paymentMethod?: string | null;

  source: string;

  notes?: string | null;

  createdAt: string;

  updatedAt: string;

}


/* ==========================
   SALE REQUEST
========================== */

export interface SaleRequest {

  companyId: string;

  saleDate: string;

  customerId?: string | null;

  customerName?: string | null;

  productId?: string | null;

  productName: string;

  quantity: number;

  unitPrice: number;

  paymentMethod: string;

  source: string;

  notes?: string | null;

}


@Injectable({
  providedIn: 'root'
})
export class SalesApiService {


  private readonly apiUrl =
    'http://localhost:8082/api/sales';


  constructor(
    private http: HttpClient
  ) {}


  /* ==========================
     IMPORT EXCEL
  ========================== */

  importExcel(
    companyId: string,
    file: File
  ): Observable<SaleImportResponse> {


    const formData =
      new FormData();


    formData.append(
      'companyId',
      companyId
    );


    formData.append(
      'file',
      file
    );


    return this.http.post<SaleImportResponse>(
      `${this.apiUrl}/import`,
      formData
    );

  }


  /* ==========================
     GET SALES
  ========================== */

  getSales():
    Observable<Sale[]> {


    return this.http.get<Sale[]>(
      this.apiUrl
    );

  }


  /* ==========================
     GET SALE BY ID
  ========================== */

  getSaleById(
    id: string
  ): Observable<Sale> {


    return this.http.get<Sale>(
      `${this.apiUrl}/${id}`
    );

  }


  /* ==========================
     CREATE SALE
  ========================== */

  createSale(
    sale: SaleRequest
  ): Observable<Sale> {


    return this.http.post<Sale>(
      this.apiUrl,
      sale
    );

  }


  /* ==========================
     UPDATE SALE
  ========================== */

  updateSale(
    id: string,
    sale: SaleRequest
  ): Observable<Sale> {


    return this.http.put<Sale>(
      `${this.apiUrl}/${id}`,
      sale
    );

  }


  /* ==========================
     DELETE SALE
  ========================== */

  deleteSale(
    id: string
  ): Observable<void> {


    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}