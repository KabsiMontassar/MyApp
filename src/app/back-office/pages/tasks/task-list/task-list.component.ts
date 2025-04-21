import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Tache } from 'src/app/back-office/models/tache.model';
import { StatutTache } from 'src/app/back-office/models/statut-tache.enum';
import { TacheService } from '../../taches/taches-service.service';
import { StatusDisplayPipe } from 'src/app/back-office/pipes/statusDisplay.pipe';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() status!: StatutTache;
  @Input() tasks: Tache[] = [];
  @Input() connectedTo: string[] = [];
  
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Tache[]>>();
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskEdited = new EventEmitter<Tache>();

  onTaskDrop(event: CdkDragDrop<Tache[]>): void {
    this.taskDropped.emit(event);
  }

  onDeleteTask(taskId: number): void {
    this.taskDeleted.emit(taskId);
  }

  onEditTask(task: Tache): void {
    this.taskEdited.emit(task);
  }

  trackByTaskId(index: number, task: Tache): number {
    return task.idTache!;
  }
}