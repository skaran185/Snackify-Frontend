import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private baseUrl = `${environment.apiUrl}`;
  public currentRestaurant = "";

  constructor(private http: HttpClient) { }

  getRestaurants(): Observable<any> {
    return this.http.get(`${this.baseUrl}/restaurants`);
  }

  getMenuItems(restaurantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/menuitems/restaurant/${restaurantId}`);
  }
}
