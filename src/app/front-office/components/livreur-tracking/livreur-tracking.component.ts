import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PositionService } from 'src/app/services/position.service';
const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-livreur-tracking',
  templateUrl: './livreur-tracking.component.html',
  styleUrls: ['./livreur-tracking.component.css']
})
export class LivreurTrackingComponent implements OnInit {
  private map!: L.Map; // CORRECTION : préciser le type
  private marker!: L.Marker; // CORRECTION : ajouter "!" pour dire qu'on va l'initialiser

  constructor(private positionService: PositionService) {}

  ngOnInit(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([36.8065, 10.1815]).addTo(this.map);

    this.positionService.positionSubject.subscribe(position => {
      if (position) {
        this.marker.setLatLng([position.latitude, position.longitude]);
        this.map.panTo([position.latitude, position.longitude]);
      }
    });
  }
}
