import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { ToastService } from 'src/app/core/services/toast.services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {

  restaurantForm!: FormGroup;
  restaurantId!: string;
  isLoading = false;
  imagePreview: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private restaurantService: RestaurantService,
    private actionSheetCtrl: ActionSheetController

  ) { }

  ngOnInit() {
    this.createForm();
    // this.restaurantId = this.route.snapshot.paramMap.get('id');
    // if (this.restaurantId) {
    this.loadRestaurantData();
    // }
  }

  createForm() {
    this.restaurantForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/), Validators.maxLength(15)]],
      defaultDeliveryFee: [null, [Validators.min(0), Validators.max(9999.99)]],
      defaultTaxRate: [null, [Validators.min(0), Validators.max(100)]],
      image: ['']
    });
  }

  async loadRestaurantData() {
    const loading = await this.loadingController.create({
      message: 'Loading restaurant data...',
      spinner: 'circles'
    });

    await loading.present();

    try {
      // Replace with your actual service call
      this.restaurantService.getRestaurant().subscribe(
        (restaurant: any) => {
          debugger
          this.restaurantForm.patchValue({
            name: restaurant.name,
            description: restaurant.description,
            address: restaurant.address,
            phoneNumber: restaurant.phoneNumber,
            defaultDeliveryFee: restaurant.defaultDeliveryFee,
            defaultTaxRate: restaurant.defaultTaxRate
          });

          if (restaurant.image) {
            this.imagePreview = environment.imageUrl + restaurant.image;
          }

          loading.dismiss();
        },
        (error: any) => {
          loading.dismiss();
          this.presentErrorAlert('Failed to load restaurant data');
          console.error('Error loading restaurant:', error);
        }
      );
    } catch (err) {
      loading.dismiss();
      this.presentErrorAlert('An unexpected error occurred');
      console.error(err);
    }
  }

  async takePicture() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => {
            this.addImage(CameraSource.Camera);
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: () => {
            this.addImage(CameraSource.Photos);
          }
        },
        {
          text: 'Remove Image',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removeImage();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    debugger
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source
      });

      // Check if image.dataUrl is defined before assigning
      if (image.dataUrl) {
        this.imagePreview = image.dataUrl;

        // Set the image URL in the form - modify validator if necessary for data URLs
        const imageUrlControl = this.restaurantForm.get('image');
        if (imageUrlControl) {
          // Remove URL pattern validator since we're using data URL
          imageUrlControl.clearValidators();
          imageUrlControl.setValue(image.dataUrl);
          imageUrlControl.updateValueAndValidity();
        }
      }
    } catch (error) {
      console.error('Error capturing image', error);
    }
  }

  removeImage() {
    this.imagePreview = null;

    // Clear the image URL and reset validator
    const imageUrlControl = this.restaurantForm.get('image');
    if (imageUrlControl) {
      imageUrlControl.setValidators(Validators.pattern('https?://.+'));
      imageUrlControl.setValue('');
      imageUrlControl.updateValueAndValidity();
    }
  }

  async onSubmit() {
    if (this.restaurantForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.restaurantForm.controls).forEach(key => {
        this.restaurantForm.controls[key].markAsTouched();
      });
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving changes...',
      spinner: 'circles'
    });

    await loading.present();

    try {
      const formData = this.restaurantForm.value;
      if (formData.image) {
        let base64Img = formData.image;
        formData.image = this.imagePreview;
        formData.base64Img = base64Img;
      }

      this.restaurantService.updateRestaurant(formData).subscribe(
        () => {
          this.loadRestaurantData();
          loading.dismiss();
          this.presentSuccessToast('Restaurant updated successfully');
        },
        (error: any) => {
          loading.dismiss();
          this.presentErrorAlert('Failed to update restaurant');
          console.error('Error updating restaurant:', error);
        }
      );

    } catch (err) {
      loading.dismiss();
      this.presentErrorAlert('An unexpected error occurred');
      console.error(err);
    }
  }

  async presentSuccessToast(message: string) {
    await this.toastController.presentSuccessToast(message);
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Helper method to display validation errors
  getErrorMessage(controlName: string): string {
    const control = this.restaurantForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid format';
    }
    if (control?.hasError('maxlength')) {
      return `Maximum length exceeded`;
    }
    if (control?.hasError('min')) {
      return 'Value is too small';
    }
    if (control?.hasError('max')) {
      return 'Value is too large';
    }

    return '';
  }

}
