import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080'; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  /**
   * Test network connectivity
   */
  testConnectivity(): Observable<any> {
    console.log('🔄 Testing network connectivity...');
    return this.http.get(`${this.baseUrl}/health`);
  }
}