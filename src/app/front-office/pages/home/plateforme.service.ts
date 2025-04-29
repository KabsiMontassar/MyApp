import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface report {
  TotalPlateformes : number ,
  ExpiredPlateformes : number , 
  ActivePlateformes : number
}
@Injectable({
  providedIn: 'root'
})
export class PlateformeService {
  private apiUrl = `http://localhost:8081/plateforme`;

  constructor(private http: HttpClient) {}





  getRandomPlateforme(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/random`);
  }

}
