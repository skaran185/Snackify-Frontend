import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { CouponService } from 'src/app/core/services/coupon.service'; // Import the coupon service
import { MenuService } from 'src/app/core/services/menu.service';
import { CouponListPage } from '../../coupon-list/coupon-list.page';
import { AddressService } from 'src/app/core/services/address.service';
import { AddressListPage } from '../../address-list/address-list.page';
import { OrderService } from 'src/app/core/services/order.service';
import { OrderDetailsComponent } from '../../orders/order-details/order-details.component';
import { Location } from '@angular/common';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CashfreeService } from 'src/app/core/services/cashfree.service';
import { ToastService } from 'src/app/core/services/toast.services';
import { CFEnvironment, CFPaymentGateway, CFSession, CFWebCheckoutPayment } from "@awesome-cordova-plugins/cashfree-pg";
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public cartItems$: Observable<any[]> = this.cartService.cartItems$;
  coupons: any[] = []; // Add observable for coupons
  selectedCoupon: any;
  couponCode: string = '';
  deliveryInstructions: string = '';
  discount: any;
  deliveryFee: number = 0;
  orderTax: number = 0;
  addresses: any[] = []; // Store all addresses
  deliveryAddress: string = ''; // Selected delivery address
  defaultAddress: any; // Selected delivery address
  selectedAddress: any; // To hold the selected address

  constructor(private cartService: CartService,
    private couponService: CouponService,
    private menuService: MenuService,
    private authService: AuthService,
    private modalController: ModalController,
    private addressService: AddressService,
    private orderService: OrderService,
    private toastService: ToastService,
    private location: Location,
    private cashfreeService: CashfreeService,
    private router: Router,
    private loadingController: LoadingController,
    private loaderService :LoaderService
  ) {
    this.addressService.getAddressesForUser();
  }
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    debugger
    this.deliveryFee = this.cartService.currentRestaurant.defaultDeliveryFee;
    this.orderTax = this.cartService.currentRestaurant.defaultTaxRate;
    this.loadDetails();
    //this.handleSuccessfulPayment('','order_638790113009051591'); // success
  }

  ionViewWillEnter() {
    debugger
    this.loadDetails();
  }

  loadDetails() {
    if (!this.cartService.cartItems.value || this.cartService.cartItems.value.length <= 0) {
      this.router.navigate(['/tabs/food'])
    }
    else {
      this.selectedAddress = this.addressService.currentAddress;
      this.cartItems$ = this.cartService.cartItems$;
    }
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
    const items = this.cartService.getCartItemsValue();

    let updatedItems = items.map((cartItem: any) => {
      // Check if the item matches and the quantity is greater than 0
      if (cartItem.menuItem.id === item.menuItem.id && cartItem.quantity > 0) {
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      }
      return cartItem;
    });

    // Filter out items with quantity 0
    updatedItems = updatedItems.filter(cartItem => cartItem.quantity > 0);

    if (updatedItems.length === 0) {
      this.cartService.clearCart();
    } else {
      this.cartService.cartItems.next(updatedItems);
    }
  }


  getTaxes(): number {
    debugger
    const total = this.getGrandTotal();
    return total * (this.orderTax / 100); // 10% tax
  }

  async openCouponModal() {
    const modal = await this.modalController.create({
      component: CouponListPage,
      cssClass: 'fullscreen-modal'
    });

    modal.onDidDismiss().then((dataReturned: any) => {
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
    // const items = this.cartService.getCartItemsValue();
    // let item = items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    return this.cartService.totalAmount.value;
  }

  getGrandTotal(): number {
    // Calculate the total after discount and add delivery fee
    let total = this.cartService.totalAmount.value;
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

    modal.onDidDismiss().then((result: any) => {
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
      this.toastService.presentErrorToast('Please select a delivery address!');
    }
    else {
      let order = {
        "restaurantId": this.cartService.currentRestaurant.restaurantID,
        "totalAmount": this.getTotal(),
        "grandTotal": this.getGrandTotal(),
        "discount": this.discount,
        "charges": this.deliveryFee,
        "deliveryAddress": this.addressService.currentAddress.addressId,
        "deliveryInstructions": this.deliveryInstructions,
        "couponId": this.selectedCoupon ? this.selectedCoupon?.couponId : null,
        "orderItems": []
      };

      const itemsArray = this.cartService.cartItems.value.map(item => ({
        menuItemId: item.menuItem?.id,
        quantity: item.quantity,
        itemVariationId: item.menuItem?.selectedVariation?.id
      }));

      order.orderItems = itemsArray as [];
      this.initializePayment(order);
    }
  }

  saveOrder(order: any) {
    this.orderService.placeOrder(order).subscribe((res: any) => {
      debugger
      if (res && res.orderId) {

      }
    })
  }

  async openOrders(orderId: any) {
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: {
        id: orderId,
      }
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
      }
    });
    return await modal.present();
  }

  async initializePayment(order: any) {
    let user = this.authService.getUser();
    const orderData = {
      orderAmount: order.grandTotal,
      orderCurrency: 'INR',
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phoneNumber
    };

    this.cashfreeService.createOrder(orderData).subscribe(
      (response: any) => {
        order.TransactionId = response.orderId;
        this.saveOrder(order);
        console.log(response);
        this.initiateWebPayment(response.orderId, response.paymentSessionId, order);
      },
      (error: any) => {
        console.error('Order creation failed:', error);
      }
    );
  }

  async initiateWebPayment(orderId: any, paymentSessionId: any, order: any) {
    try {

      // Show loading indicator
      const loading = await this.loadingController.create({
        message: 'Preparing payment...',
      });
      await loading.present();

      // Define callback functions
      const callbacks = {
        onVerify: (result: any) => {
          console.log("Payment verification successful: ", JSON.stringify(result));
          loading.dismiss();
          // Handle successful payment
          this.handleSuccessfulPayment(result, orderId);
        },
        onError: (error: any) => {
          console.log("Payment error: ", JSON.stringify(error));
          loading.dismiss();
          // Handle payment error
          this.handlePaymentError(error);
        }
      };

      // Set the callback functions
      CFPaymentGateway.setCallback(callbacks);

      // Initiate web checkout
      CFPaymentGateway.doWebCheckoutPayment(
        new CFWebCheckoutPayment(
          new CFSession(
            paymentSessionId,  // This should come from your .NET backend
            orderId,           // This should be your order ID
            CFEnvironment.SANDBOX   // Use PRODUCTION for live environment
          ),
          null  // Payment components - null means use the default components
        )
      );
    } catch (error) {
      console.error('Error in payment initialization:', error);
      // Dismiss loading indicator if there's an error
      if (this.loadingController) {
        this.loadingController.dismiss();
      }
      // Show error to user
      this.toastService.presentErrorToast('Failed to initialize payment. Please try again.');
    }
  }

  // Handle successful payment
  private handleSuccessfulPayment(result: any, orderId: any) {
    // Send the result to your backend to verify payment
    this.cashfreeService.verifyPayment(orderId).subscribe(
      (verificationResponse) => {
        debugger
        if (verificationResponse.isSuccess) {
          this.loaderService.hide();

          this.toastService.presentSuccessToast('Order placed successfully!');

          this.modalController.dismiss().then(() => {
            this.cartService.clearCart();
            this.openOrders(verificationResponse.actualOrderId);
          });

          this.openOrders(verificationResponse.actualOrderId);
          // Navigate to success page or order confirmation
        } else {
          this.toastService.presentErrorToast('Payment was processed but verification failed. Please contact support.');
        }
      },
      (error: any) => {
        console.error('Verification error:', error);
        this.toastService.presentErrorToast('Failed to verify payment status. Please contact support.');
      }
    );
  }

  // Handle payment error
  private handlePaymentError(error: any) {
    let errorMessage = 'Payment failed. Please try again.';

    // Extract more specific error message if available
    if (error && error.message) {
      errorMessage = error.message;
    }

    this.toastService.presentErrorToast(errorMessage);
  }
}
