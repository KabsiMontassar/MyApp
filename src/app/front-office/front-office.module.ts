import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ShopComponent } from './pages/shop/shop.component';
import { SingleProductComponent } from './pages/single-product/single-product.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorComponentFront } from './components/error/error.component';
import { FooterComponent } from './components/footer/footer.component';
import { FrontNavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [
    FrontofficeLayoutComponent,
    HomeComponent,
    AboutComponent,
    ShopComponent,
    SingleProductComponent,
    CartComponent,
    WishlistComponent,
    CheckoutComponent,
    ContactComponent,
    ErrorComponentFront,
    FooterComponent,
    FrontNavComponent

  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule
  ]
})
export class FrontOfficeModule { }
