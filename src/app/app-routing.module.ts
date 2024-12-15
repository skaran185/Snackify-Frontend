import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs/food', pathMatch: 'full' },
  {
    path: 'tabs/food',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard]
  },

  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'menu', loadChildren: () => import('./features/menu/menu.module').then(m => m.MenuModule), canActivate: [AuthGuard] },
  { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin'] } },
  { path: 'owner', loadChildren: () => import('./features/owner/owner.module').then(m => m.OwnerModule), canActivate: [AuthGuard, RoleGuard], data: { roles: ['RestaurantOwner'] } },
  {
    path: 'coupon-list',
    loadChildren: () => import('./features/coupon-list/coupon-list.module').then(m => m.CouponListPageModule)
  },
  {
    path: 'address-list',
    loadChildren: () => import('./features/address-list/address-list.module').then(m => m.AddressListPageModule)
  },
  {
    path: 'profile-menu',
    loadChildren: () => import('./features/profile-menu/profile-menu.module').then( m => m.ProfileMenuPageModule)
  },
  {
    path: 'update-profile',
    loadChildren: () => import('./features/update-profile/update-profile.module').then( m => m.UpdateProfilePageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.module').then( m => m.OrdersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
