import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { AgriculturalZonesService } from '../../../services/agricultural-zones.service';
import { AgriculturalZone } from '../../../Models/AgriculturalZone.Model';

@Component({
  selector: 'app-agricultural-map',
  templateUrl: './agricultural-map.component.html',
  styleUrls: ['./agricultural-map.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class AgriculturalMapComponent implements AfterViewInit, OnChanges {
  @Input() productName: string = '';
  @Input() showAllZones: boolean = false;
  @Input() mapHeight: string = '400px';
  @Input() mapWidth: string = '100%';
  
  private map!: L.Map;
  private markersLayer!: L.LayerGroup;
  private zones: AgriculturalZone[] = [];
  selectedZone: AgriculturalZone | null = null;
  
  constructor(private zoneService: AgriculturalZonesService) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadAgriculturalZones();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productName'] && !changes['productName'].firstChange) {
      this.loadAgriculturalZones();
    }
  }

  private initMap(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        // Create the map centered on Tunisia
        this.map = L.map('map', {
          center: [34.0, 9.8],  // Center of Tunisia
          zoom: 7,
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: false  // Hide attribution for cleaner look
        });

        // Add OpenStreetMap tiles with custom options
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          minZoom: 6,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);
        
        // Add attribution in a better position
        L.control.attribution({
          position: 'bottomleft'
        }).addAttribution('&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>').addTo(this.map);
        
        // Create layer group for markers
        this.markersLayer = L.layerGroup().addTo(this.map);
        
        // Add some subtle pan effects when the map is ready
        setTimeout(() => {
          this.map.panBy([5, 0], { 
            duration: 2.5,
            easeLinearity: 0.5
          });
        }, 1000);
      }
    }, 100);
  }

  private loadAgriculturalZones(): void {
    if (this.productName) {
      this.zoneService.getZonesByProductName(this.productName).subscribe(zones => {
        this.zones = zones;
        this.addZonesToMap();
        
        // Center map on the first zone and zoom in more
        if (this.zones.length > 0 && this.map) {
          this.map.setView([this.zones[0].latitude, this.zones[0].longitude], 10);
          // Auto-select the first zone after a brief delay to give time for the map to render
          setTimeout(() => {
            if (this.zones.length > 0) {
              this.showZoneDetails(this.zones[0]);
            }
          }, 800);
        }
      });
    } else if (this.showAllZones) {
      this.zoneService.getAgriculturalZones().subscribe(zones => {
        this.zones = zones;
        this.addZonesToMap();
      });
    }
  }

  private addZonesToMap(): void {
    if (!this.map || !this.markersLayer) {
      setTimeout(() => this.addZonesToMap(), 100);
      return;
    }

    // Clear existing markers
    this.markersLayer.clearLayers();

    this.zones.forEach(zone => {
      // Create circle marker for each agricultural zone
      const marker = L.circleMarker([zone.latitude, zone.longitude], {
        radius: 35,  // Much larger radius
        fillColor: zone.color || '#4caf50',
        fillOpacity: 0.9,  // Very opaque
        color: '#ffffff',
        weight: 3,  // Thicker border
        className: 'pulsating-circle'
      }).addTo(this.markersLayer);

      // Add a popup with the zone name
      marker.bindTooltip(zone.name, {
        permanent: false,
        direction: 'top',
        className: 'zone-tooltip'
      });

      // Add click event to show zone details
      marker.on('click', () => this.showZoneDetails(zone));
      
      // For better visibility, also add a text label for the region
      L.marker([zone.latitude, zone.longitude], {
        icon: L.divIcon({
          html: `<div class="map-region-label">${zone.name}</div>`,
          className: 'map-region-label-container',
          iconSize: [100, 20],
          iconAnchor: [50, 30]
        })
      }).addTo(this.markersLayer);
    });
  }

  showZoneDetails(zone: AgriculturalZone): void {
    this.selectedZone = zone;
    // Fly to the selected zone with a higher zoom level for better visibility
    this.map.flyTo([zone.latitude, zone.longitude], 11, {
      duration: 1.5
    });
    
    // Add a highlight effect to the marker
    this.markersLayer.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker) {
        if (layer.getLatLng().lat === zone.latitude && layer.getLatLng().lng === zone.longitude) {
          // Apply extra highlight to selected marker
          layer.setStyle({
            radius: 40,
            weight: 5,
            fillOpacity: 1
          });
        } else {
          // Fade out other markers
          layer.setStyle({
            fillOpacity: 0.3
          });
        }
      }
    });
  }

  closeDetails(): void {
    this.selectedZone = null;
    // Reset the map view to show all of Tunisia
    this.map.flyTo([34.0, 9.5], 7, {
      duration: 1.5
    });
    
    // Reset all markers to their original style
    this.markersLayer.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker) {
        layer.setStyle({
          radius: 35,
          weight: 3,
          fillOpacity: 0.9
        });
      }
    });
  }
}
