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
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { EditProductComponent } from './pages/products/edit-product/edit-product.component';
import { AddStockComponent } from './pages/stocks/add-stock/add-stock.component';
import { EditStockComponent } from './pages/stocks/edit-stock/edit-stock.component';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { AddCategorieComponent } from './pages/categorie/add-categorie/add-categorie.component';
import { EditCategorieComponent } from './pages/categorie/edit-categorie/edit-categorie.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AvisProduitsComponent } from './pages/avis-produits/avis-produits.component';

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
    NavComponent,
    AddProductComponent,
    EditProductComponent,
    AddStockComponent,
    EditStockComponent,
    CategorieComponent,
    AddCategorieComponent,
    EditCategorieComponent,
    AvisProduitsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    BackofficeRoutingModule
  ]
})
export class BackOfficeModule { }
