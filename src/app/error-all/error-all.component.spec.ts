import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAllComponent } from './error-all.component';

describe('ErrorAllComponent', () => {
  let component: ErrorAllComponent;
  let fixture: ComponentFixture<ErrorAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorAllComponent]
    });
    fixture = TestBed.createComponent(ErrorAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
