import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { OrderService } from 'src/app/core/services/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {

  order: any;
  public imageUrl: string = environment.imageUrl;

  constructor(
    private orderService: OrderService,
    private navParams: NavParams,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    let orderId = this.navParams.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe((data: any) => {
        this.order = data;
      });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
