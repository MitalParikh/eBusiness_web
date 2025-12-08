import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LoggingService, ErrorLog } from './logging.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private loggingService: LoggingService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the current user observable and handle token injection
    return this.handleRequest(request, next);
        
  }

  private handleRequest(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    // Add request logging
    this.logRequest(request);

    return handler.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Global error logging and handling
        this.handleErrorResponse(error, request);
        return throwError(() => error);
      })
    );
  }

  private logRequest(request: HttpRequest<any>): void {
    console.group(`📡 HTTP ${request.method} Request`);
    console.log('URL:', request.url);
    console.log('Headers:', request.headers.keys().map(key => `${key}: ${request.headers.get(key)}`));
    if (request.body) {
      console.log('Body:', request.body);
    }
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  private handleErrorResponse(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.group('🚨 HTTP Error');
    console.error('Request URL:', request.url);
    console.error('Request Method:', request.method);
    console.error('Status Code:', error.status);
    console.error('Status Text:', error.statusText);
    console.error('Error Message:', error.message);
    
    if (error.error) {
      console.error('Error Details:', error.error);
    }
    
    console.error('Timestamp:', new Date().toISOString());
    console.groupEnd();

    // Handle specific error scenarios
    switch (error.status) {
      case 401:
        this.handleUnauthorizedError(error, request);
        break;
      case 403:
        this.handleForbiddenError(error, request);
        break;
      case 404:
        this.handleNotFoundError(error, request);
        break;
      case 500:
        this.handleServerError(error, request);
        break;
      case 0:
        this.handleNetworkError(error, request);
        break;
      default:
        this.handleGenericError(error, request);
    }

    // Log to external service (example)
    this.logErrorToExternalService(error, request);
  }

  private handleUnauthorizedError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.warn('🔐 Unauthorized access - User needs to login');
    // Could trigger a logout or redirect to login page
    // this.authService.signOut();
    // this.router.navigate(['/login']);
  }

  private handleForbiddenError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.warn('🚫 Forbidden - User lacks permission for this resource');
    // Could show a "no permission" message
  }

  private handleNotFoundError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.warn('📭 Resource not found:', request.url);
    // Could show a "resource not found" message
  }

  private handleServerError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.error('🏥 Internal server error - Please try again later');
    // Could show a generic error message to user
  }

  private handleNetworkError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.error('🌐 Network error - Check internet connection');
    // Could show a network connectivity message
  }

  private handleGenericError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.error(`❌ HTTP Error ${error.status}: ${error.statusText}`);
    // Could show a generic error message
  }

  private logErrorToExternalService(error: HttpErrorResponse, request: HttpRequest<any>): void {
    // Send error to external logging service
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      statusCode: error.status,
      statusText: error.statusText,
      errorMessage: error.message,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      additionalData: {
        errorDetails: error.error,
        requestHeaders: this.getRequestHeaders(request)
      }
    };

    console.log('📊 Error logged for external service:', errorLog);
    
    // Send to logging service
    this.loggingService.logError(errorLog).subscribe({
      next: () => console.log('✅ Error successfully logged to external service'),
      error: (logError) => console.error('❌ Failed to log error to external service:', logError)
    });
  }

  private getCurrentUserId(): string | null {
    // Get current user ID if available
    return 'user-id-placeholder'; // Replace with actual user ID logic
  }

  private getRequestHeaders(request: HttpRequest<any>): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    request.headers.keys().forEach(key => {
      const value = request.headers.get(key);
      if (value) {
        headers[key] = value;
      }
    });
    return headers;
  }
}