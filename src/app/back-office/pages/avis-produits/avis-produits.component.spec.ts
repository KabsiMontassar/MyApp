import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisProduitsComponent } from './avis-produits.component';

describe('AvisProduitsComponent', () => {
  let component: AvisProduitsComponent;
  let fixture: ComponentFixture<AvisProduitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvisProduitsComponent]
    });
    fixture = TestBed.createComponent(AvisProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
