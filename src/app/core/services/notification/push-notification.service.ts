import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user.service';
import { Capacitor } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})


export class NotificationService {

    private redirect = new BehaviorSubject<any>(null);

    getRedirect() {
        this.redirect.asObservable();
    }

    constructor(private storage: UserService) {
    }

   


}
