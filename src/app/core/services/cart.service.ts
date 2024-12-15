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

  constructor(private alertController: AlertController) { }

  /**
   * Adds an item to the cart. Checks if the item is from the same restaurant,
   * and if not, prompts the user to overwrite the existing cart items.
   * @param menuItem - The menu item to add to the cart
   * @param quantity - The quantity of the menu item
   * @param restaurantId - The restaurant ID of the menu item
   */
  async addToCart(menuItem: any, quantity: number) {
    // Check if there are items in the cart from a different restaurant
    let restaurantId = menuItem.restaurantId
    if (this.currentRestaurantId && this.currentRestaurantId !== restaurantId) {
      const userConfirmed = await this.showConfirmOverwritePopup();

      if (!userConfirmed) {
        return; // Exit if the user does not confirm
      }

      this.clearCart(); // Clear the cart if confirmed
    }

    // Set the current restaurant ID if it's a new cart
    this.currentRestaurantId = restaurantId;

    // Add the item to the cart (either new or after clearing the cart)
    const items = this.cartItems.getValue();
    const existingItem = items.find(item => item.menuItem.id === menuItem.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ menuItem, quantity });
    }
    this.cartItems.next(items); // Update the value
  }

  /**
   * Removes an item from the cart.
   * @param menuItemId - The ID of the menu item to remove
   */
  removeFromCart(menuItemId: string) {
    const items = this.cartItems.getValue();
    const updatedItems = items.filter(item => item.menuItem.id !== menuItemId);
    this.cartItems.next(updatedItems); // Update the value

    // Reset currentRestaurantId if cart is empty
    if (updatedItems.length === 0) {
      this.currentRestaurantId = null;
    }
  }

  /**
   * Clears the cart and resets the restaurant ID.
   */
  clearCart() {
    this.cartItems.next([]); // Clear the cart
    this.currentRestaurantId = null; // Reset restaurant ID
  }

  /**
   * Gets the current cart items value.
   * @returns - The current cart items as an array
   */
  getCartItemsValue(): any[] {
    return this.cartItems.getValue(); // Method to get current value
  }

  /**
   * Shows a confirmation popup asking the user if they want to overwrite the cart.
   * @returns - A promise that resolves to true if the user confirms, false otherwise
   */
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
              resolve(false); // Return false if user cancels
            }
          },
          {
            text: 'Overwrite',
            handler: () => {
              resolve(true); // Return true if user confirms overwrite
            }
          }
        ]
      });

      await alert.present();
    });
  }
}
