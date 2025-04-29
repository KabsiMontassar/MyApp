import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { ErrorAllComponent } from './error-all/error-all.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStripeModule } from 'ngx-stripe';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ErrorAllComponent,
    AppComponent,
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule, 
    NgxPaginationModule, NgbModule,
    BrowserAnimationsModule, // Required for animations
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxStripeModule.forRoot('pk_test_51RDQT3P9HipHx10bx3g8OuT4xIOyUC9CiVBxbJpBfFzuzkCg4wDyR2af3MRvv9PsZSNHooMAaXKcdBFa7tGGbAsm003wkWErll'),
    NgxPaginationModule, 
    NgbModule 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }