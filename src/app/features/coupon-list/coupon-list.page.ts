import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartService } from 'src/app/core/services/cart.service';
import { CouponService } from 'src/app/core/services/coupon.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.page.html',
  styleUrls: ['./coupon-list.page.scss'],
})
export class CouponListPage implements OnInit {
  coupons: any[] = [];

  constructor(
    private modalController: ModalController,
    private couponService: CouponService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.couponService.getCoupons(this.cartService.currentRestaurantId).subscribe((res: any) => {
      this.coupons = res;
    });
  }

  applyCoupon(coupon: any) {
    this.modalController.dismiss(coupon); // Pass the selected coupon back
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
