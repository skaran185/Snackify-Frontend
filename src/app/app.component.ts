import { Component } from '@angular/core';
import { TabService } from './core/services/tab.service';
import { ModalController } from '@ionic/angular';
import { HistoryPage } from './features/orders/history/history.page';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { map } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  currentUserRole: string = '';
  cartItems: any[] = [];
  totalItems: number = 0;
  cartItemCount$ = this.cartService.cartItems$.pipe(map((items: any) => items.length));
  totalPrice: number = 90;
  isTabRoute: boolean = false;

  constructor(
    private router: Router,
    public tabService: TabService,
    private modalController: ModalController,
    private authService: AuthService, private cartService: CartService
  ) {
    this.authService.currentUserSubject.subscribe((res: any) => {
      this.initialSetup();
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Define routes where tabs should be shown
        const tabRoutes = ['/tabs/food', '/food']; // Add any other routes where tabs should show
        this.isTabRoute = tabRoutes.some(route => event.url.includes(route));
      }
    });
  }



  ionViewWillEnter() {
    this.initialSetup();
  }

  ngOnInit() {
    this.initialSetup();
  }

  isCartPage(): boolean {
    return this.router.url.includes('cart'); // Adjust the URL path as needed
  }

  initialSetup() {

    this.currentUserRole = this.authService.getUserRole();

    if (this.currentUserRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (this.currentUserRole === 'Owner') {
      this.router.navigate(['/owner']);
    } else {
      // this.router.navigate(['phone-login']);
      this.router.navigate(['/tabs/food']);
    }
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
