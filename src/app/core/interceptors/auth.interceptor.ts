// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshSubscriber: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private loaderService: LoaderService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loader for specific requests
    const skipLoader = request.headers.get('Skip-Loader') === 'true';
    
    if (!request.url.includes('/login')) {
      request = this.addToken(request);
    }

    // Show loader if not skipped
    // if (!skipLoader) {
    //   from(this.loaderService.show());
    // }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (!request.url.includes('/refresh-token')) {
            return this.handle401Error(request, next);
          } else {
            // this.loaderService.forceHide();
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      }),
      finalize(async () => {
        // if (!skipLoader) {
        //   await this.loaderService.hide().catch(err => {
        //     console.error('Error hiding loader in finalize:', err);
        //     // this.loaderService.reset();
        //   });
        // }
      })
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    return token ? request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return from(this.authService.refreshToken()).pipe(
        switchMap(token => {
          this.isRefreshing = false;
          return next.handle(this.addToken(request));
        }),
        catchError(error => {
          this.isRefreshing = false;
          // this.loaderService.forceHide();
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    }
    return next.handle(request);
  }
}