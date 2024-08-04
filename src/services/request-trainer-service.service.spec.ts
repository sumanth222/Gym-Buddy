import { TestBed } from '@angular/core/testing';

import { RequestTrainerServiceService } from './request-trainer-service.service';

describe('RequestTrainerServiceService', () => {
  let service: RequestTrainerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTrainerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
