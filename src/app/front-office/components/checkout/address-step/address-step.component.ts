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
  map!: L.Map;
  marker!: L.Marker;
  livraisonExistante?: Livraison;
  editMode = false;

  constructor(
    private livraisonService: LivraisonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initMap();

    this.livraisonService.getLivraisonByCommandeId(this.orderId).subscribe({
      next: (livraison) => {
        this.livraisonExistante = livraison;
        this.address = livraison.adresse;
        this.description = livraison.description;
        this.lat = livraison.latitude;
        this.lng = livraison.longitude;
        this.setMarker(this.lat, this.lng);
        this.map.setView([this.lat, this.lng], 13);
      },
      error: () => {
        // Aucune livraison existante : on laisse la carte au point par défaut
      }
    });
  }

  initMap(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (!this.editMode && this.livraisonExistante) return;
      const { lat, lng } = e.latlng;
      this.lat = lat;
      this.lng = lng;
      this.setMarker(lat, lng);
      this.reverseGeocode(lat, lng);
    });
  }

  setMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        this.address = data.display_name || '';
      });
  }

  enableEditMode(): void {
    this.editMode = true;
    this.toastr.info("Vous pouvez maintenant sélectionner une nouvelle adresse", "Modification activée");
  }

  goToNext(): void {
    const livraison: Livraison = {
      adresse: this.address,
      description: this.description,
      latitude: this.lat,
      longitude: this.lng,
      commandeId: this.orderId
    };

    if (this.livraisonExistante && this.editMode) {
     if (this.livraisonExistante?.idPanier !== undefined) {
  this.livraisonService.updateLivraison(this.livraisonExistante.idPanier, livraison).subscribe({
    next: () => {
      this.toastr.success('Adresse mise à jour avec succès');
      this.next.emit();
    },
    error: () => this.toastr.error('Erreur lors de la mise à jour')
  });
} else {
  this.toastr.error("ID de livraison introuvable");
};
    } else if (!this.livraisonExistante) {
      this.livraisonService.createLivraison(livraison).subscribe({
        next: () => {
          this.toastr.success('Adresse enregistrée avec succès');
          this.next.emit();
        },
        error: () => this.toastr.error('Erreur lors de l’enregistrement')
      });
    } else {
      this.next.emit(); // Pas de modification
    }
  }

  getCurrentPosition(): void {
    if (!navigator.geolocation) {
      this.toastr.error('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        this.lat = lat;
        this.lng = lng;
        this.setMarker(lat, lng);
        this.map.setView([lat, lng], 13);
        this.reverseGeocode(lat, lng);
        this.toastr.success('Position actuelle détectée');
      },
      (error) => {
        this.toastr.error('Impossible d\'obtenir votre position');
        console.error(error);
      }
    );
  }
}
