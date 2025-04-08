import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { AddressService } from 'src/app/core/services/address.service'; // Adjust the path as necessary
import { AuthService } from 'src/app/core/services/auth.service';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.page.html',
  styleUrls: ['./address-list.page.scss'],
})

export class AddressListPage {
  addresses: any[] = []; // Store addresses
  showAddressForm: boolean = false;
  addressForm: FormGroup;
  toggleAddressForm = false; // Controls the visibility of the form
  userLocation: string = '';
  isEditMode = false;
  editAddressIndex!: number;

  constructor(private addressService: AddressService,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.addressForm = this.formBuilder.group({
      addressId: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      contactNumber: ['', Validators.required], // New field for contact number
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {

      this.getUserAddress();
    }, 100);
    this.requestLocationPermission();
    this.setLocation();
  }

  getUserAddress() {
    if (this.addresses.length <= 0)
      this.addressService.getAddressesForUser();
    this.addressService.addresses.subscribe((res: any) => {
      this.addresses = res;
    })
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
    // this.userLocation = `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`;
    this.userLocation = latitude + ',' + longitude;
    console.log(this.userLocation)
    // Optionally: Use a geolocation API to convert lat/lng to an address.
  }

  selectAddress(address: any) {
    this.modalController.dismiss(address); // Pass the selected address back
  }

  addNewAddress() {
    if (this.isEditMode) {
      this.toggleAddressForm = false;
      this.isEditMode = false;
    }
    this.addressForm.reset();
    this.toggleAddressForm = !this.toggleAddressForm;
    // Optionally navigate to add address page if you have that functionality
    // this.navController.navigateForward('/add-address'); 
  }

  closeModal() {
    this.modalController.dismiss(); // Close modal
  }

  setDefaultAddress(event: Event, address: any) {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent
    this.addressService.setAsPrimary(address.addressId).subscribe((res: any) => {
      this.addressService.getAddressesForUser(true);
    })
  }

  async confirmDelete(event: Event, address: any) {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete canceled');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.isEditMode = false;
            this.addressForm.reset();
            this.toggleAddressForm = false; // Hide the form after submission
            this.deleteAddress(address);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAddress(address: any) {
    this.addressService.deleteAddress(address.addressId).subscribe((res: any) => {
      this.addressService.getAddressesForUser(true);
    })
  }

  onSubmit() {
    if (this.addressForm.valid) {

      const newAddress: any = {
        ...this.addressForm.value,
        userId: this.authService.getUserRole(),
        createdAt: new Date(),
        coordinates: this.userLocation,
      };

      if (this.addressForm.value.addressId) {
        this.addressService.updateAddress(this.addressForm.value.addressId, newAddress).subscribe(() => {
          this.addressService.getAddressesForUser(true);
          this.addressForm.reset();
          this.toggleAddressForm = false; // Hide the form after submission
        });
      }
      else {

        this.addressService.addAddress(newAddress).subscribe(() => {
          this.addressService.getAddressesForUser(true);
          this.addressForm.reset();
          this.toggleAddressForm = false; // Hide the form after submission
        });
      }

    }
  }

  editAddress(event: any, address: any) {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent
    if ((!this.addressForm.value.addressId && !this.isEditMode)) {
      this.toggleAddressForm = false;
    }
    if ((!this.addressForm.value.addressId) || this.addressForm.value.addressId && this.addressForm.value.addressId == address.addressId
    )
      this.toggleAddressForm = !this.toggleAddressForm;
    this.isEditMode = true;
    this.addressForm.patchValue(address);
    this.editAddressIndex = this.addresses.indexOf(address); // Track the index of the address being edited
  }
}
