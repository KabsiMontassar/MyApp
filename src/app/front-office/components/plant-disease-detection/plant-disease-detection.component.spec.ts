import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDiseaseDetectionComponent } from './plant-disease-detection.component';

describe('PlantDiseaseDetectionComponent', () => {
  let component: PlantDiseaseDetectionComponent;
  let fixture: ComponentFixture<PlantDiseaseDetectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlantDiseaseDetectionComponent]
    });
    fixture = TestBed.createComponent(PlantDiseaseDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
