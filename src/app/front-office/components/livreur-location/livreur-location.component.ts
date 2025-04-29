import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-livreur-location',
  templateUrl: './livreur-location.component.html',
  styleUrls: ['./livreur-location.component.css']
})
export class LivreurLocationComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(position => {
        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
          // optionnel : ajouter livreurId si nécessaire
        };
        this.http.post('http://localhost:8081/api/positions', payload)
          .subscribe(response => console.log('Position envoyée', response));
      });
    } else {
      console.error('Geolocation non supportée');
    }
  }
}
