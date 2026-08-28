import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ApiProduct {

  id: string;

  companyId: string;

  name: string;

  category?: string | null;

  sku?: string | null;

  cost?: number | null;

  price: number;

  stock: number;

  status: string;

  createdAt: string;

  updatedAt: string;

}


export interface ProductRequest {

  companyId: string;

  name: string;

  category?: string | null;

  sku?: string | null;

  cost?: number | null;

  price: number;

  stock: number;

  status?: string | null;

}


@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {


  private readonly apiUrl =
    'http://localhost:8083/api/products';


  constructor(
    private http: HttpClient
  ) {}


  getProducts():
    Observable<ApiProduct[]> {

    return this.http.get<ApiProduct[]>(
      this.apiUrl
    );

  }


  getActiveProducts():
    Observable<ApiProduct[]> {

    return this.http.get<ApiProduct[]>(
      `${this.apiUrl}/active`
    );

  }


  getProductById(
    id: string
  ): Observable<ApiProduct> {

    return this.http.get<ApiProduct>(
      `${this.apiUrl}/${id}`
    );

  }


  createProduct(
    product: ProductRequest
  ): Observable<ApiProduct> {

    return this.http.post<ApiProduct>(
      this.apiUrl,
      product
    );

  }


  updateProduct(
    id: string,
    product: ProductRequest
  ): Observable<ApiProduct> {

    return this.http.put<ApiProduct>(
      `${this.apiUrl}/${id}`,
      product
    );

  }


  deleteProduct(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}