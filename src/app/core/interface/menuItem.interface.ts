
export interface MenuItemVariation {
  menuItemVariationId: string;
  menuItemId: string;
  name: string;
  price: number;
  available: boolean;
}

export interface MenuItemCustomization {
  menuItemCustomizationId: string;
  menuItemId: string;
  name: string;
  options: string;
}

export interface MenuItem {
  id?:string;
  menuItemId: string;
  restaurantId: string;
  menuCategoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  menuItemVariations: MenuItemVariation[];
  menuItemCustomizations: MenuItemCustomization[];
}

export interface MenuCategory {
  menuCategoryId: string;
  name: string;
  createdAt: Date;
  menuItems: MenuItem[];
}