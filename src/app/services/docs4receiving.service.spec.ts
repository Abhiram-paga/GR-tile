import { TestBed } from '@angular/core/testing';

import { Docs4receivingService } from './docs4receiving.service';

describe('Docs4receivingService', () => {
  let service: Docs4receivingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Docs4receivingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
