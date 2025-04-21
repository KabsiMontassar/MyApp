import { Component, Input, Output, EventEmitter } from '@angular/core';
import { event } from 'jquery';
import { Tache } from 'src/app/back-office/models/tache.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Tache;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Tache>();

  onDelete($event: MouseEvent): void {
    $event.stopPropagation();
    this.delete.emit(this.task.idTache);
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }
}