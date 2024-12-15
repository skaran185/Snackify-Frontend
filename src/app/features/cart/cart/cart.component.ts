import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { CouponService } from 'src/app/core/services/coupon.service'; // Import the coupon service
import { MenuService } from 'src/app/core/services/menu.service';
import { CouponListPage } from '../../coupon-list/coupon-list.page';
import { AddressService } from 'src/app/core/services/address.service';
import { AddressListPage } from '../../address-list/address-list.page';
import { OrderService } from 'src/app/core/services/order.service';
import { Router } from '@angular/router';
import { HistoryPage } from '../../orders/history/history.page';
import { OrderDetailsComponent } from '../../orders/order-details/order-details.component';
import { ToastService } from 'src/app/core/services/toast.services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems$: Observable<any[]> = this.cartService.cartItems$;
  coupons: any[] = []; // Add observable for coupons
  selectedCoupon: any;
  couponCode: string = '';
  deliveryInstructions: string = '';
  discount: any;
  deliveryFee: number = 10;
  addresses: any[] = []; // Store all addresses
  deliveryAddress: string = ''; // Selected delivery address
  defaultAddress: any; // Selected delivery address
  selectedAddress: any; // To hold the selected address

  constructor(private cartService: CartService,
    private couponService: CouponService,
    private menuService: MenuService,
    private modalController: ModalController,
    private addressService: AddressService,
    private orderService: OrderService,
    private router: Router,
    private toasrService: ToastService
  ) {
    this.addressService.getAddressesForUser();
  }

  ngOnInit() {
    this.loadDetails();
  }

  ionViewWillEnter() {
    this.loadDetails();
  }

  loadDetails() {
    if (!this.cartService.cartItems.value || this.cartService.cartItems.value.length <= 0) {
      this.router.navigate(['/tabs/food'])
    }
    else {
      this.selectedAddress = this.addressService.currentAddress;

      this.cartItems$ = this.cartService.cartItems$;
      this.couponService.getCoupons(this.cartService.currentRestaurantId).subscribe((res: any) => {
        this.coupons = res;
      });
      this.addressService.addresses.subscribe((addresses: any[]) => {
        if (!this.selectedAddress)
          this.selectedAddress = addresses.find(v => v.isDefault == true);
      })
    }
  }

  addNewAddress() {
    // Logic to navigate or open a modal to add a new address
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item.menuItemId);
  }

  clearCart() {
    this.cartService.clearCart();
    this.router.navigate(['/tabs/food'])
  }

  increaseQuantity(item: any) {
    this.cartService.addToCart(item.menuItem, 1); // Increase by 1
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      const items = this.cartService.getCartItemsValue();
      const updatedItems = items.map((cartItem: any) =>
        cartItem.menuItem.menuItemId === item.menuItem.menuItemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      this.cartService.cartItems.next(updatedItems); // Ensure cartItems is of type BehaviorSubject
    }
  }

  getDeliveryFee(): number {
    return 50; // Static delivery fee or calculate based on logic
  }

  getTaxes(): number {
    const total = this.getTotal();
    return total * 0.1; // 10% tax
  }

  async openCouponModal() {
    const modal = await this.modalController.create({
      component: CouponListPage,
      cssClass: 'fullscreen-modal'
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.selectedCoupon = dataReturned.data;
        this.applyCoupon(); // Use the selected coupon
      }
    });

    return await modal.present();
  }

  applyCoupon() {
    let coupon = this.selectedCoupon;
    if (coupon.minimumOrderAmount < this.getTotal()) {
      this.couponCode = coupon.code;
      this.discount = coupon.discountType === 'Percentage'
        ? this.getTotal() * (coupon.discountValue / 100)
        : coupon.discountValue;
      if (this.discount > coupon.discountValue) {
        this.discount = coupon.discountValue;
      }
    } else {
      this.discount = 0;
      this.couponCode = '';
      this.selectedCoupon = null;
    }
  }

  getTotal(): number {
    // Calculate the total price of items in the cart
    const items = this.cartService.getCartItemsValue();
    return items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  }

  getGrandTotal(): number {
    // Calculate the total after discount and add delivery fee
    let total = this.getTotal();
    if (this.selectedCoupon && this.couponCode)
      this.applyCoupon();

    if (this.discount) {
      total = total - this.discount;
    }
    return total + this.deliveryFee;
  }

  async openAddressModal() {
    const modal = await this.modalController.create({
      component: AddressListPage,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedAddress = result.data;
        this.deliveryAddress = `${this.selectedAddress.street}, ${this.selectedAddress.city}, ${this.selectedAddress.state}, ${this.selectedAddress.zipCode}`;
      }
    });

    return await modal.present();
  }

  checkout() {
    if (!this.addressService.currentAddress ||
      !this.addressService.currentAddress.addressId) {
      this.toasrService.presentErrorToast('Please select a delivery address!');
    }
    else {
      let order = {
        "restaurantId": this.cartService.currentRestaurantId,
        "totalAmount": this.getTotal(),
        "grandTotal": this.getGrandTotal(),
        "discount": this.discount,
        "charges": this.deliveryFee,
        "deliveryAddress": this.addressService.currentAddress.addressId,
        "deliveryInstructions": this.deliveryInstructions,
        "couponId": this.selectedCoupon ? this.selectedCoupon?.couponId : '',
        "orderItems": []
      };

      const itemsArray = this.cartService.cartItems.value.map(item => ({
        menuItemId: item.menuItem?.id,
        quantity: item.quantity
      }));

      order.orderItems = itemsArray as [];
      this.orderService.placeOrder(order).subscribe((res: any) => {
        debugger
        if (res && res.orderId) {
          this.modalController.dismiss();
          this.cartService.clearCart();
          this.toasrService.presentSuccessToast('Order placed :)')
          this.openOrders(res.orderId);
        }
      })
    }
  }

  async openOrders(orderId: any) {
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: {
        id: orderId,
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
      }
    });
    return await modal.present();
  }
}
