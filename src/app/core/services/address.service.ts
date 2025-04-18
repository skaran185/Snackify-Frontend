import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private baseUrl = `${environment.apiUrl}/addresses`;

    public addresses = new BehaviorSubject<any[]>([]);
    public currentAddress: any;

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    // Get all addresses for the user
    getAddressesForUser(action = false) {
        if (!this.authService.isLoggedIn())
            return;

        this.http.get<any[]>(`${this.baseUrl}`).subscribe((res: any) => {
            this.currentAddress = res.filter((v: any) => v.isDefault)[0];
            this.addresses.next(res);
        });
    }

    // Add a new address
    addAddress(address: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, address);
    }

    // Update an existing address
    updateAddress(addressId: string, address: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${addressId}`, address);
    }

    // Update an existing address
    setAsPrimary(addressId: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/set-primary/${addressId}`, {});
    }


    // Delete an address
    deleteAddress(addressId: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${addressId}`);
    }

    // Get the default address for the user
    getDefaultAddressForUser(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/default`);
    }
}
