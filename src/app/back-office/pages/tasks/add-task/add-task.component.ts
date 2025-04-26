import { Component, EventEmitter, Output } from '@angular/core';
import { Tache } from 'src/app/Models/tache.model';
import { StatutTache } from 'src/app/Models/statut-tache.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  @Output() taskAdded = new EventEmitter<Tache>();
  taskForm: FormGroup;
  statusOptions = Object.values(StatutTache);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statutTache: [StatutTache.A_FAIRE, Validators.required]
    });
    this.taskForm.setValidators(() => {
      const debut = this.taskForm.get('dateDebut')?.value;
      const fin = this.taskForm.get('dateFin')?.value;

      return debut && fin && new Date(debut) > new Date(fin)
        ? { dateOrderInvalid: true }
        : null;
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Tache = {
        ...this.taskForm.value,
        dateDebut: new Date(this.taskForm.value.dateDebut),
        dateFin: new Date(this.taskForm.value.dateFin)
      };
      this.taskAdded.emit(newTask);
      this.taskForm.reset({
        statutTache: StatutTache.A_FAIRE
      });
    }
  }
}