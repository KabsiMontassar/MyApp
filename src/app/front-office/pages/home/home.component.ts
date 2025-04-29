import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlateformeService } from './plateforme.service';
import { DynamicLoaderService } from './dynamic-loader.service';
import { ComponentRegistry } from './component-registry';
import { settings } from './elements';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { componentServcie } from './component.service';
import { SponsorsComponent } from './plateformeComps/others/sponsors/sponsors.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { PlantDiseaseDetectionComponent } from '../../components/plant-disease-detection/plant-disease-detection.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // If the HomeComponent is not standalone, use imports in the NgModule
  // Otherwise, if it's standalone, add imports here:
  imports: [
    // ...existing imports...
    CommonModule, // Make sure CommonModule is imported for *ngIf
    SponsorsComponent
  ],
  standalone: true, // If your HomeComponent is standalone
})
export class HomeComponent implements OnInit {
  
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) dynamicContainer!: ViewContainerRef;

  selectedElements: string[] = [];
  color = new BehaviorSubject<string>("#273F4F");
  colorValue: string = "#273F4F";
  platform: any;
  sponsors: any[] = [];

  constructor(
    private dynamicLoader: DynamicLoaderService,
    private route: ActivatedRoute,
    private platformService: PlateformeService,
    private componentService : componentServcie,
  ) { 


    this.color.subscribe(value => {
      this.colorValue = value;
    });
  }

  loadSelectedComponents() {
    this.dynamicContainer.clear();
    this.selectedElements.forEach(elementKey => {
      const componentType = ComponentRegistry[elementKey];
      if (componentType) {
        this.dynamicLoader.loadComponent(
          this.dynamicContainer, 
          componentType,
          {
            ...settings[elementKey as keyof typeof settings],
            color: this.color.value,
           
          }
        );
      }
    });
  }




  ngOnInit() {
  

    this.platformService.getPlateforme(1).subscribe({
      next: (data) => {
        this.platform = data;
        console.log('Platform data:', this.platform);
        this.sponsors = data.plateformeSponsors;
        this.color.next(this.platform.couleur);
        if (this.platform.content) {
          const content = JSON.parse(this.platform.content);
          this.selectedElements = Object.values(content)
            .map((element: any) => element.type.type)
            .filter(type => ComponentRegistry[type]);
          
          const componentRequests = Object.values(content).map((element: any) => 
            this.componentService.getComponent(element.type.id)
          );

          forkJoin(componentRequests).subscribe({
            next: (components) => {
              components.forEach(component => {
                const type = component.type;
                settings[type as keyof typeof settings] = JSON.parse(component.content);
              });
              
              this.loadSelectedComponents();
            },
            error: (error) => {
              console.error('Error loading components:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading platform:', error);
      }
    });
  }
}
