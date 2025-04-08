import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  public currentRestaurantId: string | null = null;
  public currentRestaurant: any | null = null;

  public totalAmount = new BehaviorSubject<number>(0); // New public variable for total amount
  totalAmount$ = this.totalAmount.asObservable();

  constructor(private alertController: AlertController) {
    this.cartItems$.subscribe(items => {
      this.updateTotalAmount(items);
    });
  }

  async addToCart(menuItem: any, quantity: number) {
    let restaurantId = menuItem.restaurantId;
    if (this.currentRestaurantId && this.currentRestaurantId !== restaurantId) {
      const userConfirmed = await this.showConfirmOverwritePopup();

      if (!userConfirmed) {
        return;
      }

      this.clearCart();
    }

    this.currentRestaurantId = restaurantId;

    const items = this.cartItems.getValue();
    const existingItem = items.find(item => item.menuItem.id === menuItem.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ menuItem, quantity });
    }
    this.cartItems.next(items);
  }

  removeFromCart(menuItemId: string) {
    const items = this.cartItems.getValue();
    const updatedItems = items.filter(item => item.menuItem.id !== menuItemId);
    this.cartItems.next(updatedItems);

    if (updatedItems.length === 0) {
      this.currentRestaurantId = null;
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.currentRestaurantId = null;
  }

  getCartItemsValue(): any[] {
    return this.cartItems.getValue();
  }

  public updateTotalAmount(items: any[]) {
    const total = items.reduce((sum, item) => {
      const price = item.menuItem.selectedVariation ? item.menuItem.selectedVariation.price : item.menuItem.price;
      return sum + price * item.quantity;
    }, 0);
    this.totalAmount.next(total);
  }

  private async showConfirmOverwritePopup(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirm Overwrite',
        message: 'Your cart already contains items from another restaurant. Do you want to overwrite the cart?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: 'Overwrite',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });
  }
}
