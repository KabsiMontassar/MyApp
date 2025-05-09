import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressStepComponent } from './address-step.component';

describe('AddressStepComponent', () => {
  let component: AddressStepComponent;
  let fixture: ComponentFixture<AddressStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressStepComponent]
    });
    fixture = TestBed.createComponent(AddressStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
