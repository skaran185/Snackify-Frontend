import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MenuItem } from 'src/app/core/interface/menuItem.interface';
import { MenuService } from 'src/app/core/services/menu.service';
import { ToastService } from 'src/app/core/services/toast.services';

@Component({
  selector: 'app-menu-item-modal-component',
  templateUrl: './menu-item-modal-component.component.html',
  styleUrls: ['./menu-item-modal-component.component.scss'],
})
export class MenuItemModalComponent implements OnInit {

  @Input() mode!: 'add' | 'edit';
  @Input() menuItem!: MenuItem;

  menuItemForm!: FormGroup;
  restaurants: any[] = [];
  menuCategories: any[] = [];
  isLoading = false;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private menuItemService: MenuService,
    // private restaurantService: RestaurantService,
    // private menuCategoryService: MenuCategoryService,
    private toastController: ToastService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadRestaurants();
  }

  initForm() {
    this.menuItemForm = this.formBuilder.group({
      restaurantId: ['', Validators.required],
      menuCategoryId: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      imageUrl: ['', Validators.pattern('https?://.+')],
      available: [true]
    });

    if (this.mode === 'edit' && this.menuItem) {
      this.menuItemForm.patchValue({
        restaurantId: this.menuItem.restaurantId,
        menuCategoryId: this.menuItem.menuCategoryId,
        name: this.menuItem.name,
        description: this.menuItem.description,
        price: this.menuItem.price,
        imageUrl: this.menuItem.imageUrl,
        available: this.menuItem.available
      });

      // Load categories for the selected restaurant
      this.onRestaurantChange(this.menuItem.restaurantId);
    }
  }

  async loadRestaurants() {
    this.isLoading = true;
    try {
      // this.restaurants = await this.restaurantService.getRestaurants();
    } catch (error) {
      console.error('Failed to load restaurants', error);
      this.toastController.presentErrorToast('Failed to load restaurants');
    } finally {
      this.isLoading = false;
    }
  }

  async onRestaurantChange(restaurantId: string) {
    if (!restaurantId) return;

    this.isLoading = true;
    try {
      // this.menuCategories = await this.menuCategoryService.getMenuCategoriesByRestaurant(restaurantId);
    } catch (error) {
      console.error('Failed to load menu categories', error);
      this.toastController.presentErrorToast('Failed to load menu categories');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.menuItemForm.invalid) {
      this.markFormGroupTouched(this.menuItemForm);
      return;
    }

    this.isSubmitting = true;

    try {
      const formData = this.menuItemForm.value;

      if (this.mode === 'add') {
        // await this.menuItemService.addMenuItem(formData);
        this.toastController.presentSuccessToast('Menu item added successfully');
      } else {
        // await this.menuItemService.updateMenuItem({
        //   ...formData,
        //   menuItemId: this.menuItem.menuItemId
        // });
        this.toastController.presentSuccessToast('Menu item updated successfully');
      }

      this.modalController.dismiss(true, 'save');
    } catch (error) {
      console.error('Failed to save menu item', error);
      this.toastController.presentErrorToast('Failed to save menu item');
    } finally {
      this.isSubmitting = false;
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  dismiss() {
    this.modalController.dismiss(null, 'cancel');
  }

}
