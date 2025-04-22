import { Pipe, PipeTransform } from '@angular/core';
import { StatutTache } from 'src/app/Models/statut-tache.enum';

@Pipe({
  name: 'statutTachePipe'
})
export class StatutTachePipe implements PipeTransform {
  transform(value: StatutTache): string {
    switch (value) {
      case StatutTache.A_FAIRE: return 'À faire';
      case StatutTache.EN_COURS: return 'En cours';
      case StatutTache.EN_ATTENTE: return 'En attente';
      case StatutTache.TERMINEE: return 'Terminée';
      case StatutTache.ANNULEE: return 'Annulée';
      case StatutTache.RETARDEE: return 'Retardée';
      default: return value;
    }
  }
}
