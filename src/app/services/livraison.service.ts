import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Livraison } from '../Models/Livraison.Model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8081/livraison'; 

  constructor(private http: HttpClient) {}

  createLivraison(livraison: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(this.apiUrl, livraison);
  }
}
