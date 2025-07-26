import { TestBed } from '@angular/core/testing';

import { SyncApiService } from './sync-api.service';

describe('SyncApiService', () => {
  let service: SyncApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
