import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusDisplay'
})
export class StatusDisplayPipe implements PipeTransform {
  transform(value: string): string {
    const statusMap: { [key: string]: string } = {
      'A_FAIRE': 'À faire',
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'TERMINEE': 'Terminée',
      'ANNULEE': 'Annulée',
      'RETARDEE': 'Retardée'
    };
    return statusMap[value] || value;
  }
}