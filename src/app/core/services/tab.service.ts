import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  public shouldShowTabs = true;

  showTabs() {
    this.shouldShowTabs = true;
  }

  hideTabs() {
    this.shouldShowTabs = false;
  }
}
