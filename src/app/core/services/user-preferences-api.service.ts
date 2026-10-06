import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface UserPreferenceResponse {

  language: string;

  currency: string;

  theme: 'light' | 'dark' | 'system';

  notifications: {

    lowStock: boolean;

    campaigns: boolean;

    insights: boolean;

    reports: boolean;

  };

}


export interface UserPreferenceRequest {

  language: string;

  currency: string;

  theme: 'light' | 'dark' | 'system';

  notifyLowStock: boolean;

  notifyCampaigns: boolean;

  notifyInsights: boolean;

  notifyReports: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class UserPreferencesApiService {

  private readonly apiUrl =
    'http://localhost:8081/api/preferences';


  constructor(
    private http: HttpClient
  ) {}


  /* ==========================
     GET MY PREFERENCES
  ========================== */

  getMyPreferences():
    Observable<UserPreferenceResponse> {

    return this.http.get<UserPreferenceResponse>(
      `${this.apiUrl}/me`
    );

  }


  /* ==========================
     UPDATE MY PREFERENCES
  ========================== */

  updateMyPreferences(
    request: UserPreferenceRequest
  ): Observable<UserPreferenceResponse> {

    return this.http.put<UserPreferenceResponse>(
      `${this.apiUrl}/me`,
      request
    );

  }

}