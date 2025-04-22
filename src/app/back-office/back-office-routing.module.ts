import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackofficeLayoutComponent } from './layouts/backoffice-layout.component';
import { CommandesComponent } from './pages/commandes/commandes.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { PlanningComponent } from './pages/planning/planning.component';
import { ProductsComponent } from './pages/products/products.component';
import { SponsorsComponent } from './pages/sponsors/sponsors.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { ErrorComponent } from './components/error/error.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { EditProductComponent } from './pages/products/edit-product/edit-product.component';
import { AddStockComponent } from './pages/stocks/add-stock/add-stock.component';
import { EditStockComponent } from './pages/stocks/edit-stock/edit-stock.component';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { AddCategorieComponent } from './pages/categorie/add-categorie/add-categorie.component';
import { EditCategorieComponent } from './pages/categorie/edit-categorie/edit-categorie.component';
import { AvisProduitsComponent } from './pages/avis-produits/avis-produits.component';
import { TachesComponent } from './pages/taches/taches.component';
import { EmployeeComponent } from './pages/employee/employee.component';
const routes: Routes = [
  {
    path: '',
    component: BackofficeLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'commandes', component: CommandesComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeesComponent },
      {
        path: 'employee',
        loadChildren: () =>
          import('./pages/employee/employee.module').then(
            (m) => m.EmployeeModule)},
      { path: 'taches', component: TachesComponent },
      { path: 'planning', component: PlanningComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'sponsors', component: SponsorsComponent },
      { path: 'stocks', component: StocksComponent },
      { path: 'add-stock', component: AddStockComponent },
      { path: 'edit-stock/:id', component: EditStockComponent },
      { path: 'categorie', component: CategorieComponent },
      { path: 'add-categorie', component: AddCategorieComponent }, // Assuming you want to use the same component for adding categories
      { path: 'edit-categorie/:id', component: EditCategorieComponent }, // Assuming you want to use the same component for editing categories
      { path: 'avis-produits', component: AvisProduitsComponent },
      { path: '**', component: ErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
