import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, order);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const url = `${this.baseUrl}/${orderId}/status?orderStatus=` + status;  // Construct the URL with the order ID and status
    return this.http.put(url, {});
  }

  getOrderHistory(selectedStatus: string, filter: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/history?filter=${filter}&status=` + selectedStatus);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}/details`);
  }
}
