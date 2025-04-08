import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { cartAnimations } from './animation';
import { TabService } from 'src/app/core/services/tab.service';

@Component({
  selector: 'app-floating-cart',
  templateUrl: './floating-cart.component.html',
  styleUrls: ['./floating-cart.component.scss'],
  animations: cartAnimations
})
export class FloatingCartComponent {
  cartItems: any[] = [];
  cartItemCount$ = this.cartService.cartItems$.pipe(map(items => items.length));
  totalAmount: number = 0;
  currentRestaurant: any;
  restaurantName!: string;
  cartState = 'down'; // Initial state of the cart
  isHomeRoute: boolean = false;

  constructor(public cartService: CartService, private router: Router,
    public tabService: TabService
  ) {
    this.cartService.totalAmount$.subscribe((res: any) => {
      this.totalAmount = res;
      this.getCurrentRestaurant();
    });
    if (true) {
      this.cartState = 'up';
    }

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Check if we're on the home/food route
      this.isHomeRoute = event.url.includes('/tabs/food') || event.url.includes('/food');
      console.log('Current route:', event.url, 'isHomeRoute:', this.isHomeRoute); // For debugging
    });
  }

  viewCart(event: any) {
    event.stopPropagation();
    this.router.navigate(['/cart']); // Navigate to your cart page
  }

  getCurrentRestaurant() {
    let resturant: any = localStorage.getItem('currentRestaurant') || null;
    if (resturant) {
      let cRestaurant = JSON.parse(resturant);
      this.currentRestaurant = cRestaurant;
    }
  }

  clearCart(event: any) {
    event.stopPropagation();
    this.cartService.clearCart();
  }

  goToRestaurantMenu(event: any) {
    event.stopPropagation();
    this.router.navigate(['/menu'], { state: { data: this.currentRestaurant } });
  }

  toggleCartState() {
    this.cartState = this.cartState === 'up' ? 'down' : 'up';
  }
}
