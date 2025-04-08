import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/users`;
  public currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>("");

  private accessTokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());
  private refreshTokenUrl = this.baseUrl + '/refresh-token';

  constructor(private http: HttpClient,
    private cartService: CartService
  ) {
    let ff = localStorage.getItem('currentUser');
    if (ff) {
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(ff.toString()));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserRole(): string {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role : null;
  }

  getUserId(): string {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.userID : null;
  }

  setCurrentUser(response: any): void {
    this.setTokens(response);
    this.setUser(response.user);
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }

  setUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return this.accessTokenSubject.value;
  }

  // Retrieve access token from local storage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Retrieve refresh token from local storage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Save new tokens in local storage
  setTokens(response: any): void {
    const newAccessToken = response.token;
    const newRefreshToken = response.refreshToken;
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('accessToken', newAccessToken);
    this.accessTokenSubject.next(newAccessToken);
  }

  // Refresh the access token using the refresh token
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.refreshTokenUrl, { token: this.getAccessToken(), refreshToken }, { headers }).pipe(
      tap(response => {
        this.setTokens(response);
      }),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  // Logout and clear tokens
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.clear();
    this.accessTokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.cartService.clearCart();
  }

}
