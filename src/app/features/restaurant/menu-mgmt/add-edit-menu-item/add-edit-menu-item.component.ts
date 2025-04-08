import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController, ActionSheetController, Platform } from '@ionic/angular';
import { MenuCategory, MenuItem } from 'src/app/core/interface/menuItem.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MenuService } from 'src/app/core/services/menu.service';
import { ToastService } from 'src/app/core/services/toast.services';

@Component({
  selector: 'app-add-edit-menu-item',
  templateUrl: './add-edit-menu-item.component.html',
  styleUrls: ['./add-edit-menu-item.component.scss'],
})
export class AddEditMenuItemComponent implements OnInit {
  @Input() menuItem?: MenuItem;
  @Input() categories: MenuCategory[] = [];
  @Input() selectedCategoryId?: string;

  menuItemForm: FormGroup;
  isEditMode = false;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private toast: ToastService,
    private menuService: MenuService,
  ) {
    this.menuItemForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      imageUrl: ['', Validators.pattern(/\.(jpg|jpeg|png|gif)$/i)],
      available: [true],
      menuCategoryId: ['', Validators.required],
      restaurantId: ['', ''],
      variations: this.fb.array([]),
      customizations: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.menuItem) {
      this.isEditMode = true;
      this.menuItemForm.patchValue({
        name: this.menuItem.name,
        description: this.menuItem.description,
        price: this.menuItem.price,
        imageUrl: this.menuItem.imageUrl,
        available: this.menuItem.available,
        menuCategoryId: this.menuItem.menuCategoryId,
        restaurantId: this.menuItem.restaurantId
      });

      // Set image preview if there's an existing image
      if (this.menuItem.imageUrl) {
        this.imagePreview = this.menuItem.imageUrl;
      }

      // Load variations
      if (this.menuItem.menuItemVariations) {
        this.menuItem.menuItemVariations.forEach(variation => {
          this.addVariation(variation.menuItemVariationId, variation.name, variation.price, variation.available);
        });
      }

      // Load customizations
      if (this.menuItem.menuItemCustomizations) {
        this.menuItem.menuItemCustomizations.forEach(customization => {
          this.addCustomization(customization.name, customization.options);
        });
      }
    } else if (this.selectedCategoryId) {
      this.menuItemForm.patchValue({
        menuCategoryId: this.selectedCategoryId,
        // Assuming restaurantId is available from a service or parent component
        restaurantId: localStorage.getItem('currentRestaurantId') || ''
      });
    }
  }

  get variations() {
    return this.menuItemForm.get('variations') as FormArray;
  }

  get customizations() {
    return this.menuItemForm.get('customizations') as FormArray;
  }

  addVariation(menuItemVariationId: any = '', name: string = '', price: number = 0, available: boolean = true) {
    this.variations.push(this.fb.group({
      id: [menuItemVariationId, [Validators.required, Validators.maxLength(50)]],
      name: [name, [Validators.required, Validators.maxLength(50)]],
      price: [price, [Validators.required, Validators.min(0), Validators.max(1000)]],
      available: [available]
    }));
  }

  removeVariation(index: number) {
    this.variations.removeAt(index);
  }

  addCustomization(name: string = '', options: string = '') {
    this.customizations.push(this.fb.group({
      name: [name, [Validators.required, Validators.maxLength(50)]],
      options: [options, Validators.maxLength(100)]
    }));
  }

  removeCustomization(index: number) {
    this.customizations.removeAt(index);
  }

  async openImagePicker() {
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
        const imageUrlControl = this.menuItemForm.get('imageUrl');
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
    const imageUrlControl = this.menuItemForm.get('imageUrl');
    if (imageUrlControl) {
      imageUrlControl.setValidators(Validators.pattern('https?://.+'));
      imageUrlControl.setValue('');
      imageUrlControl.updateValueAndValidity();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onSubmit() {
    console.log(this.menuItemForm.valid)
    console.log(this.menuItemForm.errors)
    console.log(this.menuItemForm)
    if (this.menuItemForm.valid) {
      // You might want to handle image upload to server here
      // and replace data URL with actual URL from server

      let data = this.menuItemForm.value
      if (!this.isEditMode) {
        // Check if a new image was selected
        data.image = data.name + '.jpg'
        if (data.imageUrl != null) {
          data.imageBase64 = data.imageUrl;
        }

        this.menuService.createMenuItem(data).subscribe({
          next: () => {
            this.toast.presentSuccessToast('Menu item added successfully');
            this.modalCtrl.dismiss(this.menuItemForm.value, 'saved');
          },
          error: (error: any) => {
            console.error('Error adding menu item', error);
            this.toast.presentErrorToast('Failed to add menu item');
          }
        });
      } else {
        data.menuItemId = this.menuItem?.menuItemId;
        data.id = data.menuItemId;

        // Check if a new image was selected
        if (data.imageUrl != this.menuItem?.imageUrl) {
          data.imageBase64 = data.imageUrl;
          data.image = data.name + '.jpg'
        } else {
          data.image = this.menuItem?.imageUrl;
        }

        this.menuService.updateMenuItem(data).subscribe({
          next: () => {
            this.toast.presentSuccessToast('Menu item updated successfully');
            this.modalCtrl.dismiss(this.menuItemForm.value, 'saved');
          },
          error: (error) => {
            console.error('Error updating menu item', error);
            this.toast.presentErrorToast('Failed to update menu item');
          }
        });
      }

    }
  }
}