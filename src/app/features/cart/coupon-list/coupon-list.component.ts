import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartService } from 'src/app/core/services/cart.service';
import { CouponService } from 'src/app/core/services/coupon.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.page.html',
  styleUrls: ['./coupon-list.page.scss'],
})
export class CouponListComponent implements OnInit {
  coupons: any[] = [];

  constructor(
    private modalController: ModalController,
    private couponService: CouponService,
    private menuService: MenuService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    // Fetch coupons specific to the restaurant
    this.couponService.getCoupons(this.cartService.currentRestaurantId).subscribe((res: any) => {
      this.coupons = res;
    });
  }

  applyCoupon(coupon: any) {
    this.modalController.dismiss(coupon.code); // Dismiss modal and return coupon code
  }

  dismissModal() {
    this.modalController.dismiss(); // Close the modal without selecting a coupon
  }
}
