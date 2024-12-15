
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/core/services/address.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { slideInRightAnimation } from 'src/app/core/slide-in-right.animation';
import { AddressListPage } from '../address-list/address-list.page';
import { UpdateProfilePage } from '../update-profile/update-profile.page';
import { HistoryPage } from '../orders/history/history.page';

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

  constructor(private modalController: ModalController,
    private authSerive: AuthService,
    private router: Router,
    public addressService: AddressService,
    private animationCtrl: AnimationController) { }

  ngOnInit() {
    const profileMenuElement = document.querySelector('.profile-menu');
    if (profileMenuElement) {
      slideInRightAnimation(this.animationCtrl, profileMenuElement).play();
    }
    this.user = this.authSerive.getUser();
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
  logout() {
    this.authSerive.logout();
    // Dismiss modal
    this.dismiss();
    this.router.navigate(['/auth/login']);
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
      }
    });
    return await modal.present();
  }
}

