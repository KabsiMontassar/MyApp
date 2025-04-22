import { Component, OnInit,  AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeService } from './employee.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  typePostes: string[] = ['MANAGER', 'EMPLOYE', 'CONTRACTUEL'];
  displayedColumns: string[] = [
    'idEmployee', 'avatar', 'nom', 'prenom', 'email', 'telephone', 'typePoste', 'salaire', 'dateEmbauche', 'actions'
  ];
  selectedEmployee: any = this.resetEmployee();
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor(private employeeService: EmployeeService, private router: Router) {}


  ngOnInit(): void {
    this.getAllEmployees();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getAvatarPath(nom: string): string {
    return `https://ui-avatars.com/api/?name=${nom}&background=3b82f6&color=fff&rounded=true&size=64`;
  }

  getAllEmployees(): void {
  this.employeeService.getAllEmployees().subscribe(
    (data) => {
      this.employees = data;
      this.dataSource = new MatTableDataSource<any>(this.employees); // Important !
      this.dataSource.paginator = this.paginator;
    },
    (error) => {
      console.error('Erreur lors de la récupération des employés', error);
    }
  );
}


  onSubmit(): void {
    const action = this.selectedEmployee.idEmployee
      ? this.employeeService.updateEmployee(this.selectedEmployee)
      : this.employeeService.addEmployee(this.selectedEmployee);

    action.subscribe(
      () => {
        this.getAllEmployees();
        this.selectedEmployee = this.resetEmployee();
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement de l\'employé', error);
      }
    );
  }

  editEmployee(emp: any): void {
    this.selectedEmployee = { ...emp };
  }

  addEmployee(): void {
    this.selectedEmployee = this.resetEmployee();
  }

  deleteEmployee(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeeService.removeEmployee(id).subscribe(
        () => { this.getAllEmployees(); },
        (error) => { console.error('Suppression impossible', error); }
      );
    }
  }

  resetEmployee(): any {
    return {
      idEmployee: null,
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      typePoste: '',
      salaire: null,
      dateEmbauche: null
    };
  }
  goToPlanning(id: number) {
  this.router.navigate(['/backoffice/planning']);
}

}

