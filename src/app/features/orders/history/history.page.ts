import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/core/services/order.service';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { CartService } from 'src/app/core/services/cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  isLoading: boolean = true;  // Simulate loading state
  orders: any[] = [];
  applyFilter() {

  }

  constructor(private navController: NavController,
    private modalController: ModalController,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.orderService.getOrderHistory('', '').subscribe(
      (res: any) => {
        if (res) {
          this.orders = res;
          this.isLoading = false;
          this.applyFilter();
        }
      },
      (error) => {
        console.error('Error fetching orders', error);
        this.isLoading = false;
      }
    );
  }


  // Navigate to Order Details
  async viewOrderDetails(order: any) {
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: {
        id: order.orderId,
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
      }
    });
    return await modal.present();
  }

  // Return icon based on order status
  statusIcon(status: string) {
    switch (status) {
      case 'Delivered':
        return 'checkmark-circle-outline';
      case 'Pending':
        return 'hourglass-outline';
      case 'Cancelled':
        return 'close-circle-outline';
      default:
        return 'alert-circle-outline';
    }
  }

  // Return color based on status
  getStatusColor(status: string) {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  }

  // Dismiss modal
  dismiss() {
    this.modalController.dismiss();
  }

  // Reorder function
  reorder(order: any) {
    this.orderService.getOrderById(order.orderId).subscribe((data: any) => {
      this.repeatOrder(data);
    });
  }

  repeatOrder(data: any) {
    debugger
    this.cartService.clearCart();
    for (const item of data.orderItems) {
      item.menuItem.id = item.menuItem.menuItemId
      this.cartService.addToCart(item.menuItem, item.quantity);
    }
    // Navigate to the cart page after adding items

    
    localStorage.removeItem('currentRestaurant');
    localStorage.setItem('currentRestaurant', JSON.stringify(data.restaurant));

    this.router.navigate(['/cart']);
    this.modalController.dismiss(true);
  }
}
