import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { MenuCategory, MenuItem } from 'src/app/core/interface/menuItem.interface';
import { MenuService } from 'src/app/core/services/menu.service';
import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';
import { AddEditMenuItemComponent } from '../add-edit-menu-item/add-edit-menu-item.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.scss'],
})
export class MenulistComponent implements OnInit {
  categories: MenuCategory[] = [];
  selectedCategory: MenuCategory | null = null;
  menuItems: MenuItem[] = [];
  isLoading = false;

  constructor(
    private menuService: MenuService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController // Added LoadingController
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.menuService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
        if (this.categories.length > 0 && !this.selectedCategory) {
          this.selectCategory(this.categories[0]);
        }
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.isLoading = false;
        this.presentToast('Failed to load menu categories');
      }
    });
  }

  selectCategory(category: MenuCategory) {
    this.selectedCategory = category;
    this.loadMenuItems(category.menuCategoryId);
  }

  selectedMenuItems: any[] = [];

  loadMenuItems(categoryId: string) {
    this.isLoading = true;
    this.menuService.getAllMenuItems(categoryId).subscribe({
      next: (data) => {
        this.selectedMenuItems = data;
        this.menuItems = data;
        this.menuItems.forEach((element: MenuItem) => {
          element.imageUrl = environment.imageUrl + element.imageUrl;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading menu items', error);
        this.isLoading = false;
        this.presentToast('Failed to load menu items');
      }
    });
  }

  onSearch(event: any) {
    debugger
    let value = event.target.value;
    if (value) {
      this.menuItems = this.selectedMenuItems.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.menuItems = this.selectedMenuItems;
    }
  }

  async addCategory() {
    const modal = await this.modalCtrl.create({
      component: AddEditCategoryComponent
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) {
      this.menuService.createCategory(data).subscribe({
        next: () => {
          this.loadCategories();
          this.presentToast('Category added successfully');
        },
        error: (error) => {
          console.error('Error adding category', error);
          this.presentToast('Failed to add category');
        }
      });
    }
  }

  async editCategory(category: MenuCategory) {
    const modal = await this.modalCtrl.create({
      component: AddEditCategoryComponent,
      componentProps: { category }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) {
      data.id = category.menuCategoryId;
      this.menuService.updateCategory(data).subscribe({
        next: () => {
          this.loadCategories();
          this.presentToast('Category updated successfully');
        },
        error: (error) => {
          console.error('Error updating category', error);
          this.presentToast('Failed to update category');
        }
      });
    }
  }

  async deleteCategory(category: MenuCategory) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete "${category.name}"? This will also delete all menu items in this category.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.menuService.deleteCategory(category.menuCategoryId).subscribe({
              next: () => {
                this.loadCategories();
                this.presentToast('Category deleted successfully');
              },
              error: (error) => {
                console.error('Error deleting category', error);
                this.presentToast('Failed to delete category');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async addMenuItem() {
    if (!this.selectedCategory) return;

    const modal = await this.modalCtrl.create({
      component: AddEditMenuItemComponent,
      componentProps: {
        categories: this.categories,
        selectedCategoryId: this.selectedCategory.menuCategoryId
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'saved' && data) {
      this.loadMenuItems(this.selectedCategory!.menuCategoryId);
    }
  }

  async editMenuItem(item: MenuItem) {
    const modal = await this.modalCtrl.create({
      component: AddEditMenuItemComponent,
      componentProps: {
        menuItem: item,
        categories: this.categories
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    debugger
    if (role === 'saved' && data) {
      this.loadMenuItems(this.selectedCategory!.menuCategoryId);
    }
  }

  async deleteMenuItem(item: MenuItem) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete "${item.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.menuService.deleteMenuItem(item.menuItemId).subscribe({
              next: () => {
                this.loadMenuItems(this.selectedCategory!.menuCategoryId);
                this.presentToast('Menu item deleted successfully');
              },
              error: (error) => {
                console.error('Error deleting menu item', error);
                this.presentToast('Failed to delete menu item');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async toggleItemAvailability(item: MenuItem) {
    let updatedItem = { ...item, available: !item.available };
    updatedItem.id = item.menuItemId;
    this.menuService.updateMenuItem(updatedItem).subscribe({
      next: () => {
        item.available = !item.available;
        this.presentToast(`${item.name} is now ${item.available ? 'available' : 'unavailable'}`);
      },
      error: (error) => {
        console.error('Error updating availability', error);
        this.presentToast('Failed to update availability');
      }
    });
  }

  // New helper methods for image processing
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message
    });
    await loading.present();
    return loading;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}