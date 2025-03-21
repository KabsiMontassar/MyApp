import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './back-office-routing.module';
import { BackofficeLayoutComponent } from './layouts/backoffice-layout.component';
import { CommandesComponent } from './pages/commandes/commandes.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { PlanningComponent } from './pages/planning/planning.component';
import { ProductsComponent } from './pages/products/products.component';
import { SponsorsComponent } from './pages/sponsors/sponsors.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { ErrorComponent } from './components/error/error.component';

import { NavComponent } from './components/nav/nav.component';
@NgModule({
  declarations: [
    BackofficeLayoutComponent,
    CommandesComponent,
    DashboardComponent,
    EmployeesComponent,
    PlanningComponent,
    ProductsComponent,
    SponsorsComponent,
    StocksComponent,
    ErrorComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule
  ]
})
export class BackOfficeModule { }
