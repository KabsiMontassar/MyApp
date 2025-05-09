import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStripeModule } from 'ngx-stripe';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

// Import components but don't declare them - they are standalone
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';
import { ShopingCartComponent } from './pages/shoping-cart/shoping-cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { FrontNavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorComponentFront } from './components/error/error.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout.component';
import { PaymentComponent } from './components/checkout/payment/payment.component';
import { AddressStepComponent } from './components/checkout/address-step/address-step.component';
import { UserComponent } from './components/checkout/user/user.component';
import { ConfirmationComponent } from './components/checkout/confirmation/confirmation.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AccountComponent } from './pages/account/account.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
//import { PlantDiseaseDetectionComponent } from './components/plant-disease-detection/plant-disease-detection.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { LivreurTrackingComponent } from './components/livreur-tracking/livreur-tracking.component';
import { LivreurLocationComponent } from './components/livreur-location/livreur-location.component';
import { CenteredheroComponent } from './pages/home/plateformeComps/heros/centeredhero/centeredhero.component';
import { VerticallycenteredheroComponent } from './pages/home/plateformeComps/heros/verticallycenteredhero/verticallycenteredhero.component';
import { HerowithimageComponent } from './pages/home/plateformeComps/heros/herowithimage/herowithimage.component';
import { HeaderwithiconsComponent } from './pages/home/plateformeComps/heros/headerwithicons/headerwithicons.component';
import { CustomcardsComponent } from './pages/home/plateformeComps/features/customcards/customcards.component';
import { ColumnswithiconsComponent } from './pages/home/plateformeComps/features/columnswithicons/columnswithicons.component';
import { HeadingsComponent } from './pages/home/plateformeComps/others/headings/headings.component';
import { HeadingleftwithimageComponent } from './pages/home/plateformeComps/others/headingleftwithimage/headingleftwithimage.component';
import { HeadingrightwithimageComponent } from './pages/home/plateformeComps/others/headingrightwithimage/headingrightwithimage.component';
import { NewsletterComponent } from './pages/home/plateformeComps/others/newsletter/newsletter.component';
import { SponsorsComponent } from './pages/home/plateformeComps/others/sponsors/sponsors.component';
import { plateformeaboutComponent } from './pages/home/plateformeComps/others/about/about.component';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
    FrontofficeLayoutComponent,
    FrontNavComponent,
    FooterComponent,
    PaymentComponent,
    AddressStepComponent,
    UserComponent,
    ConfirmationComponent,
    CheckoutComponent,
    MyOrdersComponent,
    ShopingCartComponent,
    MyOrdersComponent,
    LivreurTrackingComponent,
    LivreurLocationComponent,
    
 
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
    CenteredheroComponent,
    VerticallycenteredheroComponent,
    HerowithimageComponent,
    HeaderwithiconsComponent,
    CustomcardsComponent,
    ColumnswithiconsComponent,
    HeadingsComponent,
    HeadingleftwithimageComponent,
    HeadingrightwithimageComponent,
    NewsletterComponent,
    plateformeaboutComponent,
  ],
})
export class FrontOfficeModule { }
