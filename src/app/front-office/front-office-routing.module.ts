import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout.component';

import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';
import { ShopingCartComponent } from './pages/shoping-cart/shoping-cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

import {ErrorComponentFront} from './components/error/error.component';
const routes: Routes = [
  {
    path: '',
    component: FrontofficeLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
       {path : 'home', component : HomeComponent},
       {path : 'contact', component : ContactComponent},
       {path : 'shop', component : ShopComponent},
       {path : 'shop-details/:id', component : ShopDetailsComponent},
       {path : 'shoping-cart', component : ShopingCartComponent},
       {path : 'checkout', component : CheckoutComponent},
       {path : 'wishlist', component : WishlistComponent},
       {path : 'error', component : ErrorComponentFront}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
