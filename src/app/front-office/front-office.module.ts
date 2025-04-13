import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';

import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';
import { ShopingCartComponent } from './pages/shoping-cart/shoping-cart.component';

import { FrontNavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import {ErrorComponentFront} from './components/error/error.component';

import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './components/payment-form/payment.component';
import { NgxStripeModule } from 'ngx-stripe';


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
    FrontNavComponent,
    FooterComponent,
    ErrorComponentFront,
    PaymentComponent,
    

  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule,
    NgxPaginationModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_51RDQTVP7F0T8hpWytG3HjiS4YPwPFaUsdnbbSB2VFt8vGSQUaW70hZAXBuW2yQTHqBt9i1eGiBCaKbPOVK4ZljCF00kKHqICNM'),
  ]
})
export class FrontOfficeModule { }
