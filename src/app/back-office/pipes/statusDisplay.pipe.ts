import { Pipe, PipeTransform } from "@angular/core";
import { StatutTache } from "src/app/Models/statut-tache.enum";
@Pipe({name: 'statusDisplay'})
export class StatusDisplayPipe implements PipeTransform {
    transform(value: StatutTache | string): string{
        if (!value) return 'Unknown Status';

        const status = typeof value === 'string' ?
    value.toUpperCase() : StatutTache[value as keyof typeof StatutTache];
        switch (status) {
            case 'A_FAIRE': return 'To Do';
            case 'EN_COURS': return 'In Progress';
            case 'TERMINEE': return 'Done';
            case 'ANNULEE': return 'Cancelled';
            default: return status;
        }
    }
    }
