import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ItemCustomizationModalComponent } from '../item-customization-modal/item-customization-modal.component';
import { IonContent, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  menuCategories: any[] = [];
  displayedCategories: any[] = []; // This will be used for displaying filtered or all categories
  @ViewChild(IonContent, { static: true }) content!: IonContent;

  // Search related properties
  searchTerm: string = '';
  allItems: any[] = []; // Flattened array of all menu items

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private location: Location,
    private modalCtrl: ModalController,
    private renderer: Renderer2,
  ) {
    this.cartService.cartItems.subscribe((res: any) => {
      this.updateCart();
      this.checkForCart();
    });
  }

  ngOnInit(): void {
    this.getMenuItems();
  }

  updateCart() {
    this.cartService.cartItems$.subscribe((res: any) => {
      this.cartItems = new Map<string, number>();
      res.forEach((element: any) => {
        this.cartItems.set(element.menuItem.id, element.quantity)
      });
    })
  }

  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.getMenuItems();
  }

  getMenuItems() {
    this.loading = true; // Start loading
    this.restaurant = history.state.data;
    // this.restaurant.image = this.imageUrl + this.restaurant.image;
    this.restaurant.rating = 4.5;
    this.restaurant.cuisines = 'Indian, Chinese';
    this.restaurant.priceForTwo = 500;
    this.restaurant.deliveryTime = 30;
    this.restaurant.distance = 2.5;

    localStorage.removeItem('currentRestaurant');
    localStorage.setItem('currentRestaurant', JSON.stringify(this.restaurant));

    if (this.restaurant) {
      const restaurantId = this.restaurant.restaurantID;
      this.menuService.currentRestaurant = restaurantId;
      this.cartService.currentRestaurant = this.restaurant;
      this.menuService.getMenuItems(restaurantId).subscribe((items) => {
        this.menuCategories = items;
        this.menuCategories.forEach((item) =>
          item.items.forEach((element: any) => {
            element.quantity = 0;
            element.imageUrl = this.imageUrl + element.image;
          })
        );
        this.displayedCategories = [...this.menuCategories]; // Initialize displayed categories
        this.loading = false;
        this.checkForCart();
        this.prepareSearchItems(); // Prepare the flattened array for search
      });
    } else {
      this.menuCategories = [];
      this.displayedCategories = [];
      this.loading = false;
    }
  }

  // Prepare flattened array for search
  prepareSearchItems() {
    this.allItems = [];
    this.menuCategories.forEach(category => {
      category.items.forEach((item: any) => {
        // Add category info to each item for search functionality
        this.allItems.push({
          ...item,
          categoryId: category.id,
          categoryName: category.name
        });
      });
    });
  }

  // Search functionality
  searchItems(event:any) {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // Show all categories when search is empty
      this.displayedCategories = [...this.menuCategories];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();

    // Filter items that match the search term
    const filteredItems = this.allItems.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchTermLower);
      const descMatch = item.description ?
        item.description.toLowerCase().includes(searchTermLower) :
        false;

      return nameMatch || descMatch;
    });

    // Group filtered items by category
    const filteredCategories: any[] = [];
    const categoryMap = new Map();

    filteredItems.forEach(item => {
      const categoryId = item.categoryId;

      if (!categoryMap.has(categoryId)) {
        // Find the original category
        const originalCategory = this.menuCategories.find(cat => cat.id === categoryId);
        if (originalCategory) {
          // Create a new category with the same properties but empty items array
          categoryMap.set(categoryId, {
            ...originalCategory,
            items: []
          });
          filteredCategories.push(categoryMap.get(categoryId));
        }
      }

      // Remove the added properties before adding to filtered category
      const { categoryId: _, categoryName: __, ...cleanItem } = item;

      // Add the item to its category
      categoryMap.get(categoryId).items.push(cleanItem);
    });

    // Update displayed categories
    this.displayedCategories = filteredCategories;
  }

  // Clear search
  clearSearch() {
    this.searchTerm = '';
    this.displayedCategories = [...this.menuCategories];
  }

  checkForCart() {
    if (this.cartItems.size === 0) {
      this.menuCategories.forEach(cat =>
        cat.items.forEach((item: any) => item.quantity = 0) // Set initial quantity to 0
      );
    } else {
      this.cartItems.forEach((value, key) => {
        this.menuCategories.forEach(cat => {
          let item = cat.items.find((v: any) => v.id == key);
          if (item) {
            item.quantity = value;
          }
        });
      });
    }

    // Also update quantities in displayed categories
    if (this.displayedCategories && this.displayedCategories.length > 0) {
      this.cartItems.forEach((value, key) => {
        this.displayedCategories.forEach(cat => {
          let item = cat.items.find((v: any) => v.id == key);
          if (item) {
            item.quantity = value;
          }
        });
      });
    }
  }

  async openPopup(item: any, isCustomize = false) {
    const modal = await this.modalCtrl.create({
      component: ItemCustomizationModalComponent,
      componentProps: { item },
      breakpoints: [0, 0.45, 0.70],
      initialBreakpoint: 0.45,
      cssClass: 'custom-modal'
    });

    await modal.present();

    modal.onDidDismiss().then((detail) => {
      if (detail !== null && detail.data?.selectedVariation) {
        // Handle the selected variation here
        item.selectedVariation = detail.data.selectedVariation;
        this.add(item);
      }
    });
  }

  addToCart(item: any) {
    if (item?.customizations?.length > 0 || item?.variations?.length > 0) {
      this.openPopup(item);
    } else {
      this.add(item);
    }
  }

  add(item: any) {
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

  async scrollToCategory(categoryId: string) {
    const element = document.getElementById(categoryId);
    if (element && this.content) {
      await this.content.scrollToPoint(0, element.offsetTop - 80, 500);
    } else {
      console.error(`Element with id ${categoryId} not found or IonContent is not available`);
    }
  }
}