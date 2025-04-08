import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {

  private baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardData(filter: any, startDate: any = '', endDate: any = ''): Observable<any> {
    const requestBody = {
      filter,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null
    };
    return this.http.post(`${this.baseUrl}`, requestBody);
  }

}
