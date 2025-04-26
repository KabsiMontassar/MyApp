import { TestBed } from '@angular/core/testing';

import { TachesServiceService } from './taches-service.service';

describe('TachesServiceService', () => {
  let service: TachesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TachesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
