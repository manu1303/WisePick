import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface CampaignApi {

  id: string;

  companyId: string;

  name: string;

  objective: string | null;

  audience: string | null;

  channel: string | null;

  message: string | null;

  source: string;

  targetType: string | null;

  targetId: string | null;

  targetName: string | null;

  status: string;

  createdAt: string;

  updatedAt: string;
}


export interface CampaignRequest {

  companyId: string;

  name: string;

  objective?: string | null;

  audience?: string | null;

  channel?: string | null;

  message?: string | null;

  source?: string | null;

  targetType?: string | null;

  targetId?: string | null;

  targetName?: string | null;

  status?: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class CampaignsApiService {


  private readonly apiUrl =
    'http://localhost:8085/api/campaigns';


  constructor(
    private http: HttpClient
  ) {}


  getAll():
    Observable<CampaignApi[]> {

    return this.http.get<CampaignApi[]>(
      this.apiUrl
    );

  }


  getById(
    id: string
  ): Observable<CampaignApi> {

    return this.http.get<CampaignApi>(
      `${this.apiUrl}/${id}`
    );

  }


  getActive():
    Observable<CampaignApi[]> {

    return this.http.get<CampaignApi[]>(
      `${this.apiUrl}/active`
    );

  }


  getBySource(
    source: string
  ): Observable<CampaignApi[]> {

    return this.http.get<CampaignApi[]>(
      `${this.apiUrl}/source/${source}`
    );

  }


  create(
    request: CampaignRequest
  ): Observable<CampaignApi> {

    return this.http.post<CampaignApi>(
      this.apiUrl,
      request
    );

  }


  update(
    id: string,
    request: CampaignRequest
  ): Observable<CampaignApi> {

    return this.http.put<CampaignApi>(
      `${this.apiUrl}/${id}`,
      request
    );

  }


  delete(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}