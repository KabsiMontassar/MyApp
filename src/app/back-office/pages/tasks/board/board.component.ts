import { Component, OnInit } from '@angular/core';
import { TacheService } from '../../taches/taches-service.service';
import { Tache } from 'src/app/back-office/models/tache.model';
import { StatutTache } from 'src/app/back-office/models/statut-tache.enum';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TacheFormModalComponent } from 'src/app/back-office/modals/tache-form-modal/tache-form-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  taches: Tache[] = [];
  statusColumns: StatutTache[] = [
    StatutTache.A_FAIRE,
    StatutTache.EN_COURS,
    StatutTache.TERMINEE,
  ];

  tasksByStatus: { [key: string]: Tache[] } = {};
  connectedLists: string[] = [];
  stats: {
    tachesAFaire: number;
    tachesTerminees: number;
    tachesEnCours: number;
    totalTaches: number;
  } = {
    tachesAFaire: 0,
    tachesTerminees: 0,
    tachesEnCours: 0,
    totalTaches: 0,
  };
  statsGlobales: any = {};

  constructor(private dialog: MatDialog, private tacheService: TacheService) {}

  ngOnInit(): void {
    this.loadTaches();
    this.connectedLists = this.statusColumns.map(
      (status) => `status-${status}`
    );
    this.loadStats();
  }

  loadTaches(): void {
    this.tacheService.getAll().subscribe((taches) => {
      this.taches = taches;
      this.organizeTasksByStatus();
    });
  }
  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(TacheFormModalComponent, {
      width: '500px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((tache) => {
      console.log('Modal fermé avec:', tache);
      if (tache) {
        tache.position = this.tasksByStatus[tache.statutTache].length;
        this.tacheService.add(tache).subscribe((saved) => {
          this.taches.push(saved);
          this.organizeTasksByStatus();
        });
      }
    });
  }

  organizeTasksByStatus(): void {
    this.tasksByStatus = {}; //réinitialisation de l'objet qui alimente chaque colonne
    this.statusColumns.forEach((status) => {
      this.tasksByStatus[status] = this.taches
        .filter((t) => t.statutTache === status)
        .sort((a, b) => (a.position || 0) - (b.position || 0));
    });
  }

  handleTaskDrop(event: CdkDragDrop<Tache[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateTaskPositions(event.container.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id.replace(
        'status-',
        ''
      ) as StatutTache;

      if (task.statutTache !== newStatus) {
        task.statutTache = newStatus;
      }

      this.updateTask(task);
      this.updateTaskPositions(event.container.data);
    }
    this.organizeTasksByStatus();
  }

  updateTaskPositions(tasks: Tache[]): void {
    tasks.forEach((task, index) => {
      task.position = index;
      this.updateTask(task);
    });
  }

  updateTask(task: Tache): void {
    task.sousTaches = task.sousTaches ?? [];
    this.tacheService.update(task.idTache!, task).subscribe({
      next: () => console.log('Task updated successfully'),
      error: (err) => console.error('Error updating task:', err),
    });
  }

  addTask(newTask: Tache): void {
    newTask.position = this.tasksByStatus[newTask.statutTache].length;
    this.tacheService.add(newTask).subscribe((task) => {
      this.taches.push(task);
      this.organizeTasksByStatus();
    });
  }

  deleteTask(taskId: number): void {
    this.tacheService.delete(taskId).subscribe(() => {
      this.taches = this.taches.filter((t) => t.idTache !== taskId);
      this.organizeTasksByStatus();
    });
  }

  loadStats(): void {
    this.tacheService.statsGlobales().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.statsGlobales = stats;
        console.log(this.stats);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      },
    });
  }
}
