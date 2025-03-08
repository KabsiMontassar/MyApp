import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout.component';
import { AboutComponent } from './pages/about/about.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { SingleProductComponent } from './pages/single-product/single-product.component';
import { ShopComponent } from './pages/shop/shop.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ErrorComponentFront } from './components/error/error.component';

const routes: Routes = [
  {
    path: '',
    component: FrontofficeLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'home', component: HomeComponent },
      { path: 'product', component: SingleProductComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: '**', component: ErrorComponentFront }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
