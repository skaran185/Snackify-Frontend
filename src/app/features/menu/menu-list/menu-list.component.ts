import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  restaurant: any;
  cartItemCount$ = this.cartService.cartItems$.pipe(map(items => items.length));
  cartItems = new Map<string, number>(); // Track specific items in cart
  loading = true; // Track loading state
  imageUrl: string = environment.imageUrl;

  menuCategories: any[] = [
  ];
  constructor(private route: ActivatedRoute, private menuService: MenuService,
     private cartService: CartService) { }

  ngOnInit() {
    this.getMenuItems();
  }

  ionViewWillEnter() {
    this.getMenuItems();
  }

  getMenuItems() {
    this.loading = true; // Start loading
    this.restaurant = history.state.data;
    this.restaurant.image = this.imageUrl + this.restaurant.image
    this.restaurant.rating = 4.5
    this.restaurant.cuisines = "Indian, Chinese"
    this.restaurant.priceForTwo = 500
    this.restaurant.deliveryTime = 30
    this.restaurant.distance = 2.5

    if (this.restaurant) {
      const restaurantId = this.restaurant.restaurantID;
      this.menuService.currentRestaurant = restaurantId;
      this.menuService.getMenuItems(restaurantId).subscribe((items) => {
        this.menuCategories = items;
        this.menuCategories.forEach(item => item.items.forEach((element: any) => {
          element.quantity = 0;
          element.imageUrl = this.imageUrl + element.image;
        }));
        this.loading = false;
      });
    } else {
      this.menuCategories = [];
      this.loading = false;
    }
  }

  addToCart(item: any) {
    const quantity = item.quantity || 1;
    this.cartService.addToCart(item, quantity);
    this.cartItems.set(item.id, quantity); // Track item in cart
    item.quantity = quantity;
  }

  increaseQuantity(item: any) {
    if (!this.cartItems.has(item.id)) {
      this.addToCart(item); // First time adding to cart
    } else {
      item.quantity++;
      this.cartService.addToCart(item, 1); // Increase quantity in cart
      this.cartItems.set(item.id, item.quantity);
    }
  }

  decreaseQuantity(item: any) {
    if (this.cartItems.has(item.id) && item.quantity > 1) {
      item.quantity--;
      this.cartService.addToCart(item, -1); // Decrease quantity in cart
      this.cartItems.set(item.id, item.quantity);
    } else if (this.cartItems.has(item.id) && item.quantity === 1) {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item.id);
    this.cartItems.delete(item.id); // Remove from tracking
    item.quantity = 0; // Reset quantity
  }
}
