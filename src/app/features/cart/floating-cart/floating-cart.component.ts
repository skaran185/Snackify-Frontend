import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-floating-cart',
  templateUrl: './floating-cart.component.html',
  styleUrls: ['./floating-cart.component.scss'],
})
export class FloatingCartComponent {
  cartItems: any[] = [];
  totalItems: number = 0;
  cartItemCount$ = this.cartService.cartItems$.pipe(map(items => items.length));
  
  constructor(private cartService: CartService, private router: Router) {
    
  }

  viewCart() {
    this.router.navigate(['/cart']); // Navigate to your cart page
  }
}

