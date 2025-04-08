import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MenuCategory, MenuItem, MenuItemCustomization, MenuItemVariation } from '../interface/menuItem.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = `${environment.apiUrl}`;
  public currentRestaurant = "";

  constructor(private http: HttpClient) { }

  getRestaurants(): Observable<any> {
    return this.http.get(`${this.baseUrl}/restaurants`);
  }

  getMenuItems(restaurantId: string): Observable<any> {
    let url = `${this.baseUrl}/menuitems/restaurant/${restaurantId}`;
    if (!restaurantId) {
      url = `${this.baseUrl}/menuitems/restaurant/all`;
    }
    return this.http.get(url);
  }


  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return firstValueFrom(
      this.http.get<MenuItem[]>(`${this.baseUrl}/category/${categoryId}`)
    );
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    return firstValueFrom(this.http.get<MenuItem>(`${this.baseUrl}/${id}`));
  }

  // Categories
  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.baseUrl}/menucategories`);
  }

  getCategoryById(id: string): Observable<MenuCategory> {
    return this.http.get<MenuCategory>(`${this.baseUrl}/menucategories/${id}`);
  }

  createCategory(category: Partial<MenuCategory>): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(`${this.baseUrl}/menucategories`, category);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/menucategories/${category.id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/menucategories/${id}`);
  }

  // Menu Items
  getAllMenuItems(categoryId?: string): Observable<MenuItem[]> {
    const url = categoryId
      ? `${this.baseUrl}/menuitems/category/${categoryId}`
      : `${this.baseUrl}/menuitems`;
    return this.http.get<MenuItem[]>(url);
  }

  getMenuItemById(id: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/menuitems/${id}`);
  }

  createMenuItem(item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.baseUrl}/menuitems`, item);
  }

  updateMenuItem(item: MenuItem): Observable<any> {
    return this.http.put(`${this.baseUrl}/menuitems/${item.menuItemId}`, item);
  }

  updateMenuItemAvl(item: MenuItem): Observable<any> {
    return this.http.put(`${this.baseUrl}/menuitems/avl/${item.menuItemId}`, item);
  }

  deleteMenuItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/menuitems/${id}`);
  }

  // Variations
  addVariation(menuItemId: string, variation: Partial<MenuItemVariation>): Observable<MenuItemVariation> {
    return this.http.post<MenuItemVariation>(`${this.baseUrl}/menuitems/${menuItemId}/variations`, variation);
  }

  updateVariation(variation: MenuItemVariation): Observable<any> {
    return this.http.put(`${this.baseUrl}/variations/${variation.menuItemVariationId}`, variation);
  }

  deleteVariation(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/variations/${id}`);
  }

  // Customizations
  addCustomization(menuItemId: string, customization: Partial<MenuItemCustomization>): Observable<MenuItemCustomization> {
    return this.http.post<MenuItemCustomization>(`${this.baseUrl}/menuitems/${menuItemId}/customizations`, customization);
  }

  updateCustomization(customization: MenuItemCustomization): Observable<any> {
    return this.http.put(`${this.baseUrl}/customizations/${customization.menuItemCustomizationId}`, customization);
  }

  deleteCustomization(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customizations/${id}`);
  }

}
