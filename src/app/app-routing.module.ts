import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { IonicModule } from '@ionic/angular';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: 'splash',
    component: SplashScreenComponent
  },
  {
    path: '',
    redirectTo: 'tabs/food',
    pathMatch: 'full'
  },
  // {
  //   path: 'phone-login',
  //   loadChildren: () => import('./features/auth/phone-login/phone-login.module').then(m => m.PhoneLoginPageModule)
  // },
  {
    path: 'tabs/food',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'menu', 
    loadChildren: () => import('./features/menu/menu.module').then(m => m.MenuModule) 
  },
  { 
    path: 'cart', 
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['Admin'] } 
  },
  { 
    path: 'owner', 
    loadChildren: () => import('./features/restaurant/restaurant.module').then(m => m.RestaurantModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['Owner'] } 
  },
  {
    path: 'coupon-list',
    loadChildren: () => import('./features/coupon-list/coupon-list.module').then(m => m.CouponListPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'address-list',
    loadChildren: () => import('./features/address-list/address-list.module').then(m => m.AddressListPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-menu',
    loadChildren: () => import('./features/profile-menu/profile-menu.module').then(m => m.ProfileMenuPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'update-profile',
    loadChildren: () => import('./features/update-profile/update-profile.module').then(m => m.UpdateProfilePageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule), 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    IonicModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }