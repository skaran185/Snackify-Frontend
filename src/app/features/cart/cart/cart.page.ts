// cart.page.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems$: Observable<any[]> = new Observable<any[]>();  // Initialize the property

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartItems$ = this.cartService.cartItems$;
  }

  removeFromCart(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
