
import { Component } from '@angular/core';
import { AlertController, AnimationController, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/core/services/address.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { slideInRightAnimation } from 'src/app/core/slide-in-right.animation';
import { AddressListPage } from '../address-list/address-list.page';
import { UpdateProfilePage } from '../update-profile/update-profile.page';
import { HistoryPage } from '../orders/history/history.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.page.html',
  styleUrls: ['./profile-menu.page.scss'],
})
export class ProfileMenuPage {
  // Sample user data
  user = {
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
  };

  isLoggedIn: boolean = false;
  currentUserRole!: string;

  constructor(private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    public addressService: AddressService,
    private animationCtrl: AnimationController) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.currentUserSubject.subscribe((res => {
      this.loadData();
    }))
  }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.currentUserRole = this.authService.getUserRole()

    const profileMenuElement = document.querySelector('.profile-menu');
    if (profileMenuElement) {
      slideInRightAnimation(this.animationCtrl, profileMenuElement).play();
    }
    this.user = this.authService.getUser();
    if (this.user)
      this.user.address = "No address added yet :(";
    if (this.addressService.currentAddress) {
      this.user.address = this.addressService.currentAddress.street + ', '
        + this.addressService.currentAddress.city
    }
  }

  // Dismiss modal
  dismiss() {
    this.modalController.dismiss();
  }

  // Go to edit profile page
  async goToEditProfile() {
    this.openModalPopUp(UpdateProfilePage);
  }

  // View orders
  viewOrders() {
    console.log('Viewing orders...');
    this.openModalPopUp(HistoryPage);
    // Navigate to the orders page
  }

  // Logout user
  async logout() {
    if (this.isLoggedIn) {
      this.confirmLogout();
    } else {
      this.logoutCofirmed();
    }
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete canceled');
          }
        }, {
          text: 'logout',
          handler: () => {
            this.logoutCofirmed();
          }
        }
      ]
    });

    await alert.present();
  }

  logoutCofirmed() {
    this.authService.logout();
    this.dismiss();
    this.router.navigate(['/auth/login']);
  }

  signup() {
    this.authService.logout();
    this.dismiss();
    this.router.navigate(['/auth/register']);
  }

  async manageAddresses() {
    this.openModalPopUp(AddressListPage);
  }

  async openModalPopUp(targetPage: any) {
    const modal = await this.modalController.create({
      component: targetPage,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.modalController.dismiss();
      }
    });
    await modal.present();
  }
}

