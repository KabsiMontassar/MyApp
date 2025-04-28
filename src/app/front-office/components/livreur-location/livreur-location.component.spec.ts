import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurLocationComponent } from './livreur-location.component';

describe('LivreurLocationComponent', () => {
  let component: LivreurLocationComponent;
  let fixture: ComponentFixture<LivreurLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivreurLocationComponent]
    });
    fixture = TestBed.createComponent(LivreurLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
