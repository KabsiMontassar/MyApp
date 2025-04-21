import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Planning {
  idPlanning?: number;
  dateDebut: string;
  dateFin: string;
  typePlanning: string;
  employeeId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private baseUrl = 'http://localhost:8081/planning';

  constructor(private http: HttpClient) {}

  getAllPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(`${this.baseUrl}/retrieve-all-Plannings`);
  }

  getPlanningsByEmployee(employeeId: number): Observable<Planning[]> {
    return this.http.get<Planning[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  addPlanningToEmployee(employeeId: number, planning: Planning): Observable<Planning> {
    return this.http.post<Planning>(`${this.baseUrl}/add-employee-planning/${employeeId}`, planning);
  }

  updatePlanningForEmployee(employeeId: number, planning: Planning): Observable<Planning> {
    return this.http.put<Planning>(`${this.baseUrl}/update-employee-planning/${employeeId}`, planning);
  }

  deletePlanning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-Planning/${id}`);
  }

  getDureeAbsenceParType(employeeId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/duree-absence-par-type/${employeeId}`);
  }
  getPlanningsForWeek(start: Date, end: Date): Observable<Planning[]> {
  const formatDate = (d: Date) =>
    d.toISOString().split('T')[0]; // => "2025-04-14"

  const params = new HttpParams()
    .set('start', formatDate(start))
    .set('end', formatDate(end));

  return this.http.get<Planning[]>(`${this.baseUrl}/plannings-range`, { params });
}
}
