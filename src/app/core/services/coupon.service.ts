// menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(private http: HttpClient) {}

  private baseUrl = `${environment.apiUrl}/coupons`;

  getCoupons(restaurantId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${restaurantId}`);
  }
}
