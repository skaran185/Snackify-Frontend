// tab.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private _shouldShowTabs = new BehaviorSubject<boolean>(true);
  shouldShowTabs$ = this._shouldShowTabs.asObservable();
  
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Define routes where tabs should be hidden
        const hideTabsRoutes = ['/auth/login', '/auth/register', '/menu', '/cart'];
        this._shouldShowTabs.next(!hideTabsRoutes.some(route => event.url.includes(route)));
      }
    });
  }

  get shouldShowTabs(): boolean {
    return this._shouldShowTabs.value;
  }

  set shouldShowTabs(value: boolean) {
    this._shouldShowTabs.next(value);
  }
}