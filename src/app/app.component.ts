import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TabService } from './core/services/tab.service';
import { ModalController } from '@ionic/angular';
import { HistoryPage } from './features/orders/history/history.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private router: Router,
    public tabService: TabService,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    document.body.classList.add('light');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.tabService.shouldShowTabs = !(event.url === '/auth/login' || event.url === '/auth/register');
      }
    });
  }

  async openOrders() {
    const modal = await this.modalController.create({
      component: HistoryPage,
      cssClass: 'profile-menu',
    });
    await modal.present();
  }
}
