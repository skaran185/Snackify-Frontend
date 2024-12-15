import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, order);
  }

  getOrderHistory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/history`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}/details`);
  }
}
