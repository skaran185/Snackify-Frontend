import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';

const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  {
    path: 'phone-login',
    loadChildren: () => import('./phone-login/phone-login.module').then( m => m.PhoneLoginPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthPageRoutingModule { }
