import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout.component';

import { CheckoutComponent } from './components/checkout/checkout.component';

//import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password/forgot-password.component';
import { AccountComponent } from './pages/account/account.component';

import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';
import { ShopingCartComponent } from './pages/shoping-cart/shoping-cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

import {ErrorComponentFront} from './components/error/error.component';
import { PaymentComponent } from './components/checkout/payment/payment.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { LivreurLocationComponent } from './components/livreur-location/livreur-location.component';
import { LivreurTrackingComponent } from './components/livreur-tracking/livreur-tracking.component';  

const routes: Routes = [
  {
    path: '',
    component: FrontofficeLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // Direct routes without platform name
      { path: 'home', component: HomeComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'shop-details/:id', component: ShopDetailsComponent },
      { path: 'shoping-cart', component: ShopingCartComponent },
      { path: 'checkout/:id', component: CheckoutComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'signup', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'account', component: AccountComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'my-orders', component: MyOrdersComponent },
      { path: 'livreur-location', component: LivreurLocationComponent },
      { path: 'livreur-tracking', component: LivreurTrackingComponent },
      { path: 'error', component: ErrorComponentFront },
      
      // Platform-specific routes
      { path: ':platformName', redirectTo: ':platformName/home', pathMatch: 'full' },
      { path: ':platformName/home', component: HomeComponent },
      { path: ':platformName/contact', component: ContactComponent },
      { path: ':platformName/shop', component: ShopComponent },
      { path: ':platformName/shop-details/:id', component: ShopDetailsComponent },
      { path: ':platformName/shoping-cart', component: ShopingCartComponent },
      { path: ':platformName/checkout/:id', component: CheckoutComponent },
      { path: ':platformName/payment', component: PaymentComponent },
      { path: ':platformName/wishlist', component: WishlistComponent },
      { path: ':platformName/signup', component: RegisterComponent },
      { path: ':platformName/login', component: LoginComponent },
      { path: ':platformName/account', component: AccountComponent },
      { path: ':platformName/reset-password', component: ResetPasswordComponent },
      { path: ':platformName/forgot-password', component: ForgotPasswordComponent },
      { path: ':platformName/my-orders', component: MyOrdersComponent },
      { path: ':platformName/livreur-location', component: LivreurLocationComponent },
      { path: ':platformName/livreur-tracking', component: LivreurTrackingComponent },
      { path: ':platformName/error', component: ErrorComponentFront }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
