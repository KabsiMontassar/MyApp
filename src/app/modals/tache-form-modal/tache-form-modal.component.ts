// tache-form-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tache } from '../../models/tache.model';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../pages/employee/employee.service';
import { TacheService } from '../../pages/taches/taches-service.service';

@Component({
  selector: 'app-tache-form-modal',
  templateUrl: './tache-form-modal.component.html',
  styleUrls: ['./tache-form-modal.component.css']
})
export class TacheFormModalComponent {
  taskForm: FormGroup;
  employees: Employee[] = [];


  constructor(
    private employeeService: EmployeeService,
    private tacheService: TacheService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TacheFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tache
  ) {
    this.taskForm = this.fb.group({
      idTache: [data.idTache || 0],
      titre: [data.titre || '', Validators.required],
      description: [data.description || ''],
      dateDebut: [data.dateDebut || new Date(), Validators.required],
      dateFin: [data.dateFin || new Date(), Validators.required],
      statutTache: [data.statutTache, Validators.required],
      employee: [data.employee || null, Validators.required],
      parent: [data.parent || null]
    });
    this.taskForm.setValidators(()=>{
      const debut = this.taskForm.get('dateDebut')?.value;
      const fin = this.taskForm.get('dateFin')?.value;
      if(debut && fin && new Date(debut) > new Date(fin)){
        return{dateOrderInvalid:true};
      }
      return null;
    })
  }
  ngOnInit() {
  this.employeeService.getAllEmployees().subscribe((data) => {
    this.employees = data;
  });
}
  onCancel(): void {
    this.dialogRef.close(
      {
        ...this.taskForm.value,
        sousTaches: [],
        position: 0
      }
    );
  }

  onSave(): void {
  console.log('Payload envoyé :', this.taskForm.value);
  this.dialogRef.close(this.taskForm.value);
 
  
}

}
