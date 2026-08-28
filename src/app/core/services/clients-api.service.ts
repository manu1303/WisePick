import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiClient {
  id: string;
  companyId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRequest {
  companyId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  status?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsApiService {

  private readonly apiUrl = 'http://localhost:8084/api/clients';

  constructor(
    private http: HttpClient
  ) {}

  getClients(): Observable<ApiClient[]> {
    return this.http.get<ApiClient[]>(
      this.apiUrl
    );
  }

  getActiveClients(): Observable<ApiClient[]> {
    return this.http.get<ApiClient[]>(
      `${this.apiUrl}/active`
    );
  }

  getClientById(
    id: string
  ): Observable<ApiClient> {

    return this.http.get<ApiClient>(
      `${this.apiUrl}/${id}`
    );

  }

  createClient(
    client: ClientRequest
  ): Observable<ApiClient> {

    return this.http.post<ApiClient>(
      this.apiUrl,
      client
    );

  }

  updateClient(
    id: string,
    client: ClientRequest
  ): Observable<ApiClient> {

    return this.http.put<ApiClient>(
      `${this.apiUrl}/${id}`,
      client
    );

  }

  deleteClient(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}