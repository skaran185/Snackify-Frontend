import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/core/services/address.service'; // Adjust the path as necessary
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.page.html',
  styleUrls: ['./address-list.page.scss'],
})
export class AddressListPage implements OnInit {
  addresses: any[] = []; // Store addresses
  showAddressForm: boolean = false;
  addressForm: FormGroup;
  toggleAddressForm = false; // Controls the visibility of the form

  constructor(private addressService: AddressService,
    private modalController: ModalController,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.addressForm = this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      contactNumber: ['', Validators.required], // New field for contact number
    });
  }

  ngOnInit() {
    // Fetch addresses when the page initializes
    this.addressService.addresses.subscribe((res: any) => {
      this.addresses = res;
    })
  }

  selectAddress(address: any) {
    this.modalController.dismiss(address); // Pass the selected address back
  }

  addNewAddress() {
    this.modalController.dismiss(); // Close modal
    // Optionally navigate to add address page if you have that functionality
    // this.navController.navigateForward('/add-address'); 
  }

  closeModal() {
    this.modalController.dismiss(); // Close modal
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const newAddress: any = {
        ...this.addressForm.value,
        userId: this.authService.getUserRole(),
        createdAt: new Date(),
      };

      this.addressService.addAddress(newAddress).subscribe(() => {
        this.addressService.getAddressesForUser(true);
        this.addressForm.reset();
        this.toggleAddressForm = false; // Hide the form after submission
      });
    }
  }
}
