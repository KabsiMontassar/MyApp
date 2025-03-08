import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontNavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: FrontNavComponent;
  let fixture: ComponentFixture<FrontNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontNavComponent]
    });
    fixture = TestBed.createComponent(FrontNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
