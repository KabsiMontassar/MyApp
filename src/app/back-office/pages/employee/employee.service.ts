import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8081/employee';
  constructor(private http: HttpClient){}

  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/retrieve-all-Employees`);
  }
  addEmployee(employee: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/add-Employee`, employee);
  }
  updateEmployee(employee: any): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/update-Employee`, employee);
  }
  removeEmployee(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/remove-Employee/${id}` );
  }
}
