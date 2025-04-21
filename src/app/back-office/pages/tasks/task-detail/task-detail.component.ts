import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tache } from 'src/app/back-office/models/tache.model';
import { StatutTache } from 'src/app/back-office/models/statut-tache.enum';
import { TacheService } from '../../taches/taches-service.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent {
  @Input() task: Tache | null = null;
  @Output() close = new EventEmitter<void>();
  statusOptions = Object.values(StatutTache);
  showSubTaskForm = false;
  newSubTask: Partial<Tache> = {};

  constructor(private tacheService: TacheService) {}
  
  onClose(): void {
    this.close.emit();
  }

  addSubTask(): void {
    if (!this.task || this.newSubTask.titre?.trim()) return; //trim tnahi les espaces zeydin
    const subTaskData: Tache = {
      ...this.newSubTask,
      parent: this.task,
      statutTache: this.task.statutTache,
      } as Tache;
      this.tacheService.ajouterSousTache(this.task.idTache!, subTaskData).subscribe({
        next: (addedSubTask) =>{
          console.log('Sous-tâche ajoutée avec succès:', addedSubTask);
          this.task?.sousTaches?.push(addedSubTask);
          this.newSubTask = {};
          this.showSubTaskForm = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la sous-tâche:', error);  
      }
  });
}
}