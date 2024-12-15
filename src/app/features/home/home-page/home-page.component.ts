import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Router } from '@angular/router';
import { AddressService } from 'src/app/core/services/address.service';
import { ModalController } from '@ionic/angular';
import { AddressListPage } from '../../address-list/address-list.page';
import { ProfileMenuPage } from '../../profile-menu/profile-menu.page';
import { AuthService } from 'src/app/core/services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  restaurants: any[] = [];
  userInitial: any;
  userLocation: string = '';

  constructor(private menuService: MenuService,
    private router: Router,
    public addressService: AddressService,
    private modalController: ModalController,
    private authService: AuthService
  ) {
  }

  ionViewWillEnter() {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.addressService.getAddressesForUser();
    await this.requestLocationPermission();
    await this.setLocation();

    this.userInitial = this.getInitial(this.authService.getUser().name);
    this.getRestaurants();
    this.addressService.addresses.subscribe((addresses: any[]) => {
      this.addressService.currentAddress = addresses.find(v => v.isDefault == true);
      if (addresses.length == 1 || (addresses.length > 2 && !(addresses.find(v => v.isDefault == true)))) {
        this.addressService.currentAddress = addresses[0];
      }
    })
  }

  ngOnInit() {
    this.loadInitialData();
  }

  async requestLocationPermission() {
    try {
      if (Capacitor.isNativePlatform()) {
        // Mobile: Request location permission
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'denied') {
          alert('Location permission is required.');
        }
      } else {
        // Web: Use navigator geolocation if available
        if (!('geolocation' in navigator)) {
          alert('Geolocation not available in your browser.');
        }
      }
    } catch (error) {
      console.error('Error requesting location permissions', error);
    }
  }

  async setLocation() {
    try {
      if (Capacitor.isNativePlatform()) {
        // Mobile: Use Capacitor Geolocation
        const coordinates = await Geolocation.getCurrentPosition();
        this.setUserLocation(coordinates.coords.latitude, coordinates.coords.longitude);
      } else {
        // Web: Use navigator geolocation
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setUserLocation(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('Error getting location on web:', error);
            alert('Unable to retrieve your location.');
          }
        );
      }
    } catch (error) {
      console.error('Error setting location', error);
    }
  }

  setUserLocation(latitude: number, longitude: number) {
    this.userLocation = `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`;
    // Optionally: Use a geolocation API to convert lat/lng to an address.
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

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.addressService.currentAddress = result.data;
      }
    });

    return await modal.present();
  }

  getRestaurants() {
    this.menuService.getRestaurants().subscribe((restaurants) => {
      this.restaurants = restaurants;
      this.restaurants.forEach((element: any) => {
        element.image = environment.imageUrl + element.image;
      });
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
