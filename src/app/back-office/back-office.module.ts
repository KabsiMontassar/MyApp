import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NavComponent } from './components/nav/nav.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { EditProductComponent } from './pages/products/edit-product/edit-product.component';
import { AddStockComponent } from './pages/stocks/add-stock/add-stock.component';
import { EditStockComponent } from './pages/stocks/edit-stock/edit-stock.component';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { AddCategorieComponent } from './pages/categorie/add-categorie/add-categorie.component';
import { EditCategorieComponent } from './pages/categorie/edit-categorie/edit-categorie.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AvisProduitsComponent } from './pages/avis-produits/avis-produits.component';
import { AddTaskComponent } from './pages/tasks/add-task/add-task.component';
import { TaskDetailComponent } from './pages/tasks/task-detail/task-detail.component';
import { TaskItemComponent } from './pages/tasks/task-item/task-item.component';
import { TaskListComponent } from './pages/tasks/task-list/task-list.component';
import { BoardComponent } from './pages/tasks/board/board.component';
import { TachesComponent } from './pages/taches/taches.component';
import { TacheFormModalComponent } from './modals/tache-form-modal/add-task/tache-form-modal.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { StatusDisplayPipe } from '../shared/pipes/status-display.pipe';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';


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
    TaskListComponent, 
    TaskDetailComponent,
    TaskItemComponent,
    AddTaskComponent,
    BoardComponent,
    TacheFormModalComponent, 
    TachesComponent,
    EmployeeComponent,
    StatusDisplayPipe,
    AdminDashboardComponent,
    MyOrdersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BackofficeRoutingModule,
    DragDropModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatListModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
})
export class BackOfficeModule {}
