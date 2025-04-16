import { Component, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-address-step',
  templateUrl: './address-step.component.html',
  styleUrls: ['./address-step.component.scss']
})
export class AddressStepComponent {
  @Output() next = new EventEmitter<void>();
  address: string = '';

  ngOnInit(): void {
    const map = L.map('map').setView([36.8065, 10.1815], 13); // Tunis by default
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    let marker: L.Marker;
  
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
  
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
  
      this.reverseGeocode(lat, lng);
    });
  }
  
  reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        this.address = data.display_name || '';
      });
  }
  goToNext() {
    this.next.emit();
  }
}