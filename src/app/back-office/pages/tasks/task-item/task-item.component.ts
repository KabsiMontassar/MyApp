import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { error, event } from 'jquery';
import { TacheFormModalComponent } from 'src/app/back-office/modals/tache-form-modal/add-task/tache-form-modal.component';
import { Tache } from 'src/app/Models/tache.model';
import { TacheService } from '../../taches/taches-service.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent implements OnDestroy {
  @Input() task!: Tache;
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
  @Output() edit: EventEmitter<Tache> = new EventEmitter<Tache>();
  @Output() update: EventEmitter<Tache> = new EventEmitter<Tache>();
  tasks: Tache[] = [];
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private tacheService: TacheService,
    private snackbar: MatSnackBar
  ) {}

  onDelete($event: MouseEvent): void {
    $event.stopPropagation();
    this.delete.emit(this.task.idTache);
  }

  onEdit(task: Tache, $event?: MouseEvent): void {
    $event?.stopPropagation();
    const dialogRef = this.dialog.open(TacheFormModalComponent, {
      data: {
        ...task,
        idTache: task.idTache, // Explicitly ensure ID is preserved
      },
      width: '600px',
      height: '600px',
      
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.updateTask(result);
        }
      });
  }

  updateTask(updatedTask: Tache): void {
    if (this.isLoading) return;

    if (!updatedTask.idTache) {
      this.showError('ID de tâche manquant - impossible de mettre à jour');
      return;
    }

    this.isLoading = true;
    this.tacheService
      .update(updatedTask.idTache, updatedTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task: Tache) => {
          this.update.emit(task);
          this.showSuccess('Tâche mise à jour avec succès');
        },
        error: (error) => {
          console.error('Error updating task:', error);
          let errorMessage = 'Erreur lors de la mise à jour de la tâche';
          if (error.status === 400) {
            errorMessage = 'Données invalides envoyées au serveur';
          }
          this.showError(errorMessage);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  refreshTask(): void {
    this.tacheService.getAll().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  private showSuccess(message: string): void {
    this.snackbar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackbar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}