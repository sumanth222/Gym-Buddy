import { TestBed } from '@angular/core/testing';

import { TrainerInfoService } from './trainer-info.service';

describe('TrainerInfoService', () => {
  let service: TrainerInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainerInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
