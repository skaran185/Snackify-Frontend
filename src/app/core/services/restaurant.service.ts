import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/restaurants`;

  constructor(private http: HttpClient) {}

  getRestaurant(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  updateRestaurant(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, data);
  }

}
