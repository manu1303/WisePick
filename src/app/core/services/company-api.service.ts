import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Company} from '../models/company.model';


@Injectable({
  providedIn: 'root'
})
export class CompanyApiService {

  private readonly apiUrl =
    'http://localhost:8081/api/companies';


  constructor(
    private http: HttpClient
  ) {}


  /* ==========================
     CREATE
  ========================== */

  createCompany(
    company: Company
  ): Observable<Company> {

    return this.http.post<Company>(
      this.apiUrl,
      company
    );

  }


  /* ==========================
     GET ALL
  ========================== */

  getCompanies():
    Observable<Company[]> {

    return this.http.get<Company[]>(
      this.apiUrl
    );

  }


  /* ==========================
     GET BY ID
  ========================== */

  getCompanyById(
    id: string
  ): Observable<Company> {

    return this.http.get<Company>(
      `${this.apiUrl}/${id}`
    );

  }


  /* ==========================
     UPDATE
  ========================== */

  updateCompany(
    id: string,
    company: Company
  ): Observable<Company> {

    return this.http.put<Company>(
      `${this.apiUrl}/${id}`,
      company
    );

  }


  /* ==========================
     DELETE
  ========================== */

  deleteCompany(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }


  /* ==========================
     GET MY COMPANY
  ========================== */

  getMyCompany():
    Observable<Company> {

    return this.http.get<Company>(
      `${this.apiUrl}/me`
    );

  }


  /* ==========================
     CHECK MY COMPANY EXISTS
  ========================== */
  checkMyCompanyExists():
    Observable<{ exists: boolean }> {

    return this.http.get<{
      exists: boolean
    }>(
      `${this.apiUrl}/me/exists`
    );

  }


}