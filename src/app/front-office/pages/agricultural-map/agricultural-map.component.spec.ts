import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgriculturalMapComponent } from './agricultural-map.component';
import { AgriculturalZonesService } from '../../../services/agricultural-zones.service';
import { of } from 'rxjs';

describe('AgriculturalMapComponent', () => {
  let component: AgriculturalMapComponent;
  let fixture: ComponentFixture<AgriculturalMapComponent>;
  let mockZoneService: jasmine.SpyObj<AgriculturalZonesService>;

  beforeEach(() => {
    mockZoneService = jasmine.createSpyObj('AgriculturalZonesService', ['getAgriculturalZones', 'getZoneById']);
    mockZoneService.getAgriculturalZones.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [AgriculturalMapComponent],
      providers: [
        { provide: AgriculturalZonesService, useValue: mockZoneService }
      ]
    });
    fixture = TestBed.createComponent(AgriculturalMapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize map in ngAfterViewInit', () => {
    spyOn(component as any, 'initMap');
    spyOn(component as any, 'loadAgriculturalZones');
    component.ngAfterViewInit();
    expect((component as any).initMap).toHaveBeenCalled();
    expect((component as any).loadAgriculturalZones).toHaveBeenCalled();
  });

  it('should load agricultural zones from service', () => {
    component.ngAfterViewInit();
    expect(mockZoneService.getAgriculturalZones).toHaveBeenCalled();
  });
});
