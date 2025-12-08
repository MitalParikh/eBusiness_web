import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ErrorLog {
  timestamp: string;
  url: string;
  method: string;
  statusCode: number;
  statusText: string;
  errorMessage: string;
  userAgent: string;
  userId: string | null;
  sessionId?: string;
  additionalData?: any;
}

export interface RequestLog {
  timestamp: string;
  url: string;
  method: string;
  userId: string | null;
  duration?: number;
  responseStatus?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly logEndpoint = '/api/logs'; // Replace with your actual logging endpoint
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  logError(error: ErrorLog): Observable<any> {
    const enhancedError = {
      ...error,
      sessionId: this.sessionId,
      timestamp: error.timestamp || new Date().toISOString(),
      level: 'ERROR'
    };

    console.log('📤 Sending error log to server:', enhancedError);
    
    // In a real application, uncomment this to send to your logging API:
    // return this.http.post(`${this.logEndpoint}/errors`, enhancedError);
    
    // For now, just return a resolved observable
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  logRequest(request: RequestLog): Observable<any> {
    const enhancedRequest = {
      ...request,
      sessionId: this.sessionId,
      timestamp: request.timestamp || new Date().toISOString(),
      level: 'INFO'
    };

    console.log('📤 Sending request log to server:', enhancedRequest);
    
    // In a real application, uncomment this to send to your logging API:
    // return this.http.post(`${this.logEndpoint}/requests`, enhancedRequest);
    
    // For now, just return a resolved observable
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  logCustomEvent(event: string, data: any, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO'): Observable<any> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      event,
      data,
      level,
      userAgent: navigator.userAgent
    };

    console.log(`📤 Sending custom event log (${level}):`, logEntry);
    
    // In a real application, uncomment this to send to your logging API:
    // return this.http.post(`${this.logEndpoint}/events`, logEntry);
    
    // For now, just return a resolved observable
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}
