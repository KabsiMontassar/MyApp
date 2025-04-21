import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheFormModalComponent } from './tache-form-modal.component';

describe('TacheFormModalComponent', () => {
  let component: TacheFormModalComponent;
  let fixture: ComponentFixture<TacheFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TacheFormModalComponent]
    });
    fixture = TestBed.createComponent(TacheFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
