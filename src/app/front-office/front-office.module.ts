import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';


import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';
import { ShopingCartComponent } from './pages/shoping-cart/shoping-cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { FrontNavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import {ErrorComponentFront} from './components/error/error.component';

import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './components/checkout/payment/payment.component';
import { NgxStripeModule } from 'ngx-stripe';
import { AddressStepComponent } from './components/checkout/address-step/address-step.component';
import { UserComponent } from './components/checkout/user/user.component';
import { ConfirmationComponent } from './components/checkout/confirmation/confirmation.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AccountComponent } from './pages/account/account.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
//import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    FrontofficeLayoutComponent,
    CheckoutComponent,
    HomeComponent,
    ContactComponent,
    ShopComponent,
    ShopDetailsComponent,
    ShopingCartComponent,
    WishlistComponent,
    FrontNavComponent,
    FooterComponent,
    ErrorComponentFront,
    PaymentComponent,
    AddressStepComponent,
    UserComponent,
    ConfirmationComponent,
    AddressStepComponent,
    UserComponent,
    PaymentComponent,
    ConfirmationComponent,
    AccountComponent,
    SignUpComponent,
    //ResetpasswordComponent,
    ForgotPasswordComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule,
    NgxPaginationModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(
      'pk_test_51RDQTVP7F0T8hpWytG3HjiS4YPwPFaUsdnbbSB2VFt8vGSQUaW70hZAXBuW2yQTHqBt9i1eGiBCaKbPOVK4ZljCF00kKHqICNM'
    ),
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class FrontOfficeModule {}
