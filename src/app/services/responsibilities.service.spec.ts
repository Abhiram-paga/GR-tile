import { TestBed } from '@angular/core/testing';

import { ResponsibilitiesService } from './responsibilities.service';

describe('ResponsibilitiesService', () => {
  let service: ResponsibilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsibilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
