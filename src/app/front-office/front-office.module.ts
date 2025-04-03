import { NgModule } from '@angular/core';
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
import { FormsModule } from '@angular/forms';


@NgModule({
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
    ErrorComponentFront
  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule,
    FormsModule,
  ]
})
export class FrontOfficeModule { }
