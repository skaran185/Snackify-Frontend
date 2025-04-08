import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { OrderService } from 'src/app/core/services/order.service';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import moment from 'moment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  // Order data
  orders: any[] = [];
  filteredOrders: any[] = [];

  // Filters
  filterText: string = '';
  activeTab: string = 'Pending';
  selectedFilter: string = 'Today';

  // Date filters
  startDate: string = moment().startOf('day').format();
  endDate: string = moment().endOf('day').format();

  // Loading state
  isLoading: boolean = false;

  constructor(
    private orderService: OrderService,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.fetchOrders();
  }

  ionViewWillEnter() {
    this.fetchOrders();
  }

  segmentChanged(event: any) {
    this.activeTab = event.detail.value;
    this.fetchOrders();
  }

  setDateFilter(filter: string) {
    this.selectedFilter = filter;

    switch (filter) {
      case 'Today':
        this.startDate = moment().startOf('day').format();
        this.endDate = moment().endOf('day').format();
        break;
      case 'Week':
        this.startDate = moment().startOf('week').format();
        this.endDate = moment().endOf('week').format();
        break;
      case 'Month':
        this.startDate = moment().startOf('month').format();
        this.endDate = moment().endOf('month').format();
        break;
    }

    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;

    this.orderService.getOrderHistory(this.activeTab, this.selectedFilter).subscribe(
      (data: any[]) => {
        this.orders = data;
        this.applyFilter();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching orders', error);
        this.showToast('Failed to fetch orders');
        this.isLoading = false;
      }
    );
  }

  applyFilter() {
    const searchTerm = this.filterText?.trim().toLowerCase();

    if (!searchTerm) {
      this.filteredOrders = this.orders;
      return;
    }

    this.filteredOrders = this.orders.filter(order =>
      (order.customerName?.toLowerCase().includes(searchTerm) || '') ||
      (order.orderId?.toLowerCase().includes(searchTerm) || '')
    );
  }

  getItemPrice(item: any) {
    if (item.menuItemVariationID) {
      const variation = item.menuItem.menuItemVariations.find(
        (v: any) => v.menuItemVariationId === item.menuItemVariationID
      );

      return variation ? variation.price : item.menuItem.price;
    }

    return item.menuItem.price;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'primary';
      case 'Preparing':
        return 'warning';
      case 'OutForDelivery':
        return 'medium';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  }

  showActions(status: string) {
    return !['Delivered', 'Cancelled'].includes(status);
  }

  async updateOrderStatus(event: Event, order: any, status: string) {
    event.stopPropagation();
    await this.confirmStatusUpdate(event, order, status);
  }

  async confirmStatusUpdate(event: Event, order: any, status: string) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Confirm Update',
      message: `Are you sure you want to update the order status to ${status}?`,
      cssClass: 'status-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Update',
          cssClass: 'confirm-button',
          handler: () => {
            this.processStatusUpdate(order, status);
          }
        }
      ]
    });

    await alert.present();
  }

  processStatusUpdate(order: any, status: string) {
    this.isLoading = true;

    this.orderService.updateOrderStatus(order.orderId, status).subscribe(
      (updatedOrder: any) => {
        this.showToast(`Order #${order.orderId} has been updated to ${status}`);
        this.fetchOrders();
      },
      (error: any) => {
        console.error('Error updating order status', error);
        this.showToast('Failed to update order status');
        this.isLoading = false;
      }
    );
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'app-toast',
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

  async openPopup(order: any) {
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: { order },
      cssClass: 'order-details-modal',
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.8, 1],
      backdropDismiss: true,
      // swipeToClose: true
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {
      this.fetchOrders();
    }
  }
}