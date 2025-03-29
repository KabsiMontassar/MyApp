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
import { AddPComponent } from './pages/products/add-p/add-p.component';

const routes: Routes = [
  {
    path: '', 
    component: BackofficeLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'commandes', component: CommandesComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'planning', component: PlanningComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'add-p', component: AddPComponent },
      { path: 'sponsors', component: SponsorsComponent },
      { path: 'stocks', component: StocksComponent },
      { path: '**', component: ErrorComponent }, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
