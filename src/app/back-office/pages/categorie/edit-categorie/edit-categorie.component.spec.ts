import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategorieComponent } from './edit-categorie.component';

describe('EditCategorieComponent', () => {
  let component: EditCategorieComponent;
  let fixture: ComponentFixture<EditCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCategorieComponent]
    });
    fixture = TestBed.createComponent(EditCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
