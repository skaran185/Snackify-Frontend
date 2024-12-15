import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router,
    private toastService: ToastService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // Retrieve the token
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.url?.includes('redresh-token')) {
          this.toastService.presentErrorToast('Session is expired. Please login again.');
          this.router.navigate(['/auth/login']);
        }
        if (error.status === 401) { // Unauthorized
          return this.handle401Error(authReq, next);
        }
        this.toastService.presentErrorToast('Something went wrong. Please try again later.');
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshToken().pipe( // Assume refreshToken returns an observable of the new token
      switchMap((newToken: any) => {
        // Set the new token in AuthService
        this.authService.setTokens(newToken);
        // Clone the failed request with the new token
        const newRequest = request.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` }
        });
        // Retry the request with the new token
        return next.handle(newRequest);
      }),
      catchError((err) => {
        // If token refresh fails, navigate to login
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        return throwError(err);
      })
    );
  }
}
