import { Component, Output, EventEmitter, Input } from '@angular/core';
import * as L from 'leaflet';
import { LivraisonService } from 'src/app/services/livraison.service';
import { Livraison } from 'src/app/Models/Livraison.Model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address-step',
  templateUrl: './address-step.component.html',
  styleUrls: ['./address-step.component.scss']
})
export class AddressStepComponent {
  @Output() next = new EventEmitter<void>();
  @Input() orderId!: number;

  address: string = '';
  description: string = '';
  lat!: number;
  lng!: number;

  constructor(
    private livraisonService: LivraisonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const map = L.map('map').setView([36.8065, 10.1815], 13); // Tunis par défaut

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker: L.Marker;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.lat = lat;
      this.lng = lng;

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
    const livraison: Livraison = {
      adresse: this.address,
      description: this.description,
      latitude: this.lat,
      longitude: this.lng,
      commandeId: this.orderId
    };

    this.livraisonService.createLivraison(livraison).subscribe({
      next: (res) => {
        this.toastr.success('Adresse de livraison enregistrée avec succès', 'Succès');
        console.log('Livraison enregistrée avec succès :', res);
        this.next.emit();
      },
      error: (err) => {
        this.toastr.error('Erreur lors de l\'enregistrement de l\'adresse', 'Erreur');
        console.error('Erreur lors de l\'enregistrement de la livraison :', err);
      }
    });
  }
}
