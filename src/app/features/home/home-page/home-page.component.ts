import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { AddressService } from 'src/app/core/services/address.service';
import { AddressListPage } from '../../address-list/address-list.page';
import { ProfileMenuPage } from '../../profile-menu/profile-menu.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { IonContent, ModalController } from '@ionic/angular';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  restaurants: any[] = [];
  userInitial: any;
  userLocation: string = '';
  address!: string;

  @ViewChild(IonContent) content!: IonContent;
  private lastScrollTop: number = 0;
  isHeaderVisible: boolean = true;

  constructor(private menuService: MenuService,
    private router: Router,
    public addressService: AddressService,
    private modalController: ModalController,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {

  }

  ionViewWillEnter() {
    this.loadInitialData();
  }

  ionViewDidEnter() {
    this.setupScrollListener();
  }

  private setupScrollListener() {
    this.content.scrollEvents = true;

    const contentEl = this.content.getScrollElement();

    this.content.ionScroll.subscribe((event: any) => {
      const scrollTop = event.detail.scrollTop;

      // Determine scroll direction
      if (scrollTop > this.lastScrollTop && scrollTop > 50) {
        // Scrolling down
        this.isHeaderVisible = false;
      } else {
        // Scrolling up
        this.isHeaderVisible = true;
      }

      this.lastScrollTop = scrollTop;
    });
  }

  async loadInitialData() {

    if (this.authService.isLoggedIn()) {
      this.getDefaultAddress();
      this.userInitial = this.getInitial(this.authService.getUser().name);
    }

    this.getRestaurants();

    this.addressService.addresses.subscribe((res: any) => {
      this.selectedAddress();
    });

  }
  getDefaultAddress() {
    if (this.address)
      return;
    this.addressService.getDefaultAddressForUser().subscribe((res: any) => {
      this.addressService.currentAddress = res;
      this.selectedAddress();
    })
  }

  selectedAddress() {
    if (this.addressService.currentAddress) {
      this.address = this.addressService.currentAddress?.street + ', '
        + this.addressService.currentAddress?.city;
    }
  }

  // Function to get the first letter of the user's name
  getInitial(name: string): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase(); // Extract the first character and capitalize it
  }

  async openAddressModal() {
    const modal = await this.modalController.create({
      component: AddressListPage,
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
        this.addressService.currentAddress = result.data;
        this.selectedAddress();
      }
    });

    return await modal.present();
  }
  private isRestaurantSelected = false;
  getRestaurants() {
    this.menuService.getRestaurants().subscribe((restaurants) => {
      this.restaurants = restaurants;
      this.restaurants.forEach((element: any) => {
        element.image = environment.imageUrl + element.image;
      });

      if (this.restaurants.length === 1 && !this.isRestaurantSelected) {
        this.selectRestaurant(this.restaurants[0]);
        this.isRestaurantSelected = true; // Mark selection as done
      }
  
    });
  }

  selectRestaurant(restaurant: any) {
    this.router.navigate(['/menu'], { state: { data: restaurant } });
  }

  async openProfile() {
    this.openModal(ProfileMenuPage);
  }

  async openModal(page: any) {
    const modal = await this.modalController.create({
      component: page,
      cssClass: 'profile-menu',
    });
    await modal.present();
  }
}
