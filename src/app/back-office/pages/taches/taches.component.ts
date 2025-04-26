import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TacheService } from './taches-service.service';
import { Tache } from 'src/app/Models/tache.model';
import { StatutTache } from 'src/app/Models/statut-tache.enum';
import { PeriodeHistorique } from 'src/app/Models/PeriodeHistorique.enum';
import { MatDialog } from '@angular/material/dialog';
import { TacheFormModalComponent } from '../../modals/tache-form-modal/add-task/tache-form-modal.component';

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {

  taches: Tache[] = [];
  selectedTache: Tache = this.resetTache();
  statutsTaches = Object.values(StatutTache);
  tachesByStatut: { [key: string]: Tache[] } = {};
  dropListIds: string[] = [];

  constructor(private tacheService: TacheService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dropListIds = this.statutsTaches.map(s => s.toString());
    this.getAllTaches();
  }

  getColorByStatut(statut: StatutTache | string): string {
    switch (statut) {
      case StatutTache.A_FAIRE:
      case 'A_FAIRE': return '#facc15';
      case StatutTache.EN_COURS:
      case 'EN_COURS': return '#3b82f6';
      case StatutTache.TERMINEE:
      case 'TERMINEE': return '#f97316';
      default: return '#94a3b8';
    }
  }

  getAllTaches(): void {
    this.tacheService.getAll().subscribe(data => {
      this.taches = data;
      this.organiserParStatut();
    });
  }

  organiserParStatut(): void {
    this.tachesByStatut = {};
    this.statutsTaches.forEach(s => this.tachesByStatut[s] = []);
    this.taches.forEach(t => {
      if (t.statutTache in this.tachesByStatut) {
        this.tachesByStatut[t.statutTache].push(t);
      } else {
        this.tachesByStatut[t.statutTache] = [t];
      }
    });
  }

  onSubmit(): void {
    const action = this.selectedTache.idTache
      ? this.tacheService.update(this.selectedTache.idTache, this.selectedTache)
      : this.tacheService.add(this.selectedTache);

    action.subscribe(() => {
      this.getAllTaches();
      this.selectedTache = this.resetTache();
    });
  }

  ajouterNouvelleTache(statut: StatutTache): void {
    const dialogRef = this.dialog.open(TacheFormModalComponent, {
      width: '500px',
      data: {
        idTache: 0,
        titre: '',
        description: '',
        dateDebut: new Date(),
        dateFin: new Date(),
        statutTache: statut
      } as Tache
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tacheService.add(result).subscribe(() => this.getAllTaches());
      }
    });
  }

  editTache(tache: Tache): void {
    const dialogRef = this.dialog.open(TacheFormModalComponent, {
      width: '500px',
      data: { ...tache }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tacheService.update(tache.idTache, result).subscribe(() => this.getAllTaches());
      }
    });
  }

  deleteTache(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.tacheService.delete(id).subscribe(() => this.getAllTaches());
    }
  }

  resetTache(): Tache {
    return {
      idTache: 0,
      titre: '',
      description: '',
      dateDebut: new Date(),
      dateFin: new Date(),
      statutTache: StatutTache.A_FAIRE
    };
  }

  ajouterSousTache(parentId: number): void {
    const dialogRef = this.dialog.open(TacheFormModalComponent, {
      width: '500px',
      data: {
        idTache: 0,
        titre: '',
        description: '',
        dateDebut: new Date(),
        dateFin: new Date(),
        statutTache: StatutTache.A_FAIRE,
        parent: { idTache: parentId }
      } as Tache
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tacheService.ajouterSousTache(parentId, result).subscribe(() => this.getAllTaches());
      }
    });
  }

  updateSousTache(id: number, sousTache: Tache): void {
    this.tacheService.updateSousTache(id, sousTache).subscribe(() => this.getAllTaches());
  }

  deleteSousTache(id: number): void {
    this.tacheService.deleteSousTache(id).subscribe(() => this.getAllTaches());
  }

  hasSousTaches(id: number): void {
    this.tacheService.hasSousTaches(id).subscribe(console.log);
  }

  getAllDescendants(id: number): void {
    this.tacheService.getAllDescendants(id).subscribe(console.log);
  }

  countAllDescendants(id: number): void {
    this.tacheService.countAllDescendants(id).subscribe(console.log);
  }

  getProgressionTache(id: number): void {
    this.tacheService.getProgressionTache(id).subscribe(console.log);
  }

  getProgressionParEmployee(employeeId: number): void {
    this.tacheService.getProgressionParEmployee(employeeId).subscribe(console.log);
  }

  getNombreTachesParEmploye(id: number): void {
    this.tacheService.getNombreTachesParEmploye(id).subscribe(console.log);
  }

  getNombreTachesParStatut(employeeId: number): void {
    this.tacheService.getNombreTachesParStatut(employeeId).subscribe(console.log);
  }

  getTachesParStatut(statut: StatutTache): Tache[] {
    return this.tachesByStatut[statut] || [];
  }

  getTachesParStatutFromService(employeeId: number, statut: StatutTache): void {
    this.tacheService.getTachesParStatut(employeeId, statut).subscribe(console.log);
  }

  getHistoriqueParPeriode(employeeId: number, periode: PeriodeHistorique): void {
    this.tacheService.getHistoriqueParPeriode(employeeId, periode).subscribe(console.log);
  }

  getHistoriqueParDate(employeeId: number, periode: string): void {
    this.tacheService.getHistoriqueParDate(employeeId, periode).subscribe(console.log);
  }

  replanifierTaches(employeeId: number, strategie: string): void {
    this.tacheService.replanifierTaches(employeeId, strategie).subscribe(console.log);
  }

  getTacheById(id: number): void {
    this.tacheService.getById(id).subscribe(console.log);
  }

  onTacheDropped(event: CdkDragDrop<Tache[]>, newStatut: StatutTache): void {
    console.log('Drag event:', event);
    console.log('New status:', newStatut);

    const tache: Tache = event.item.data;

    if (event.previousContainer !== event.container) {
      console.log('Moving task to a new container');
      tache.statutTache = newStatut;

      this.tacheService.update(tache.idTache, tache).subscribe(() => {
        console.log('Task updated successfully in the backend');

        const previousStatut = event.previousContainer.id;
        this.tachesByStatut[previousStatut] = this.tachesByStatut[previousStatut].filter(t => t.idTache !== tache.idTache);

        this.tachesByStatut[newStatut].push(tache);
        console.log('Task moved successfully in the UI');
      }, error => {
        console.error('Failed to update task:', error);
      });
    } else {
      console.log('Reordering tasks within the same container');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

}
