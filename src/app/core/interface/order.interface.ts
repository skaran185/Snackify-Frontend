export interface Order {
    orderId: string;
    userId: string;
    user: User;
    restaurantId: string;
    restaurant: Restaurant;
    orderStatus: string;
    totalAmount: number;
    grandTotal: number;
    discount: number;
    charges: number;
    deliveryAddress: Address;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
    deliveryInstructions?: string;
  }
  
  export interface OrderItem {
    orderItemId: string;
    menuItemId: string;
    menuItem: any;
    quantity: number;
  }
  
  export interface User {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface Restaurant {
    restaurantId: string;
    name: string;
    image: string;
    address: string;
  }
  
  export interface Address {
    addressId: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    contactNumber: string;
  }
  