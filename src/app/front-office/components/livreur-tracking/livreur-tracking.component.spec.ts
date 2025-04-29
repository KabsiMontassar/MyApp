import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurTrackingComponent } from './livreur-tracking.component';

describe('LivreurTrackingComponent', () => {
  let component: LivreurTrackingComponent;
  let fixture: ComponentFixture<LivreurTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivreurTrackingComponent]
    });
    fixture = TestBed.createComponent(LivreurTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
