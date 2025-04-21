import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Ensure the correct path to the Tache model
import { Tache } from '../Models/tache.model';
import { StatutTache } from '../Models/statut-tache.enum';
import { PeriodeHistorique } from './PeriodeHistorique.enum';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'http://localhost:8081/tache';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/retrieve-all-taches`);
  }

  getById(id: number): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/retrieve-tache/${id}`);
  }
  getTachesByEmployee(employeeId: number): Observable<Tache[]> {
  return this.http.get<Tache[]>(`http://localhost:8081/tache/employee/${employeeId}`);
}


  add(tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/add-tache`, tache);
  }

  update(id: number, tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/update-tache/${id}`, tache);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-tache/${id}`);
  }

  ajouterSousTache(parentId: number, sousTache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/add-sous-tache/${parentId}`, sousTache);
  }

  updateSousTache(id: number, sousTache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/update-sous-tache/${id}`, sousTache);
  }

  deleteSousTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-sous-tache/${id}`);
  }

  hasSousTaches(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/has-sous-taches/${id}`);
  }

  getAllDescendants(id: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/descendants/${id}`);
  }

  countAllDescendants(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/descendants/count/${id}`);
  }

  getProgressionTache(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/progression/${id}`);
  }

  getProgressionParEmployee(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/progression-employe/${employeeId}`);
  }

  getNombreTachesParEmploye(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nombre-taches-par-employe/${id}`);
  }

  getNombreTachesParStatut(employeeId: number): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/nombre-taches-par-statut/${employeeId}`);
  }

  getTachesParStatut(employeeId: number, statut: StatutTache): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tache-par-statut/${employeeId}/${statut}`);
  }

  getHistoriqueParPeriode(employeeId: number, periode: PeriodeHistorique): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/historique/${employeeId}?periode=${periode}`);
  }

  getHistoriqueParDate(employeeId: number, periode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/historiqueDate/${employeeId}?periode=${periode}`);
  }

  replanifierTaches(employeeId: number, strategie: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/replanifier/${employeeId}?strategie=${strategie}`, {});
  }
  statsGlobales(): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/statistiques-globales`);
  }

}
