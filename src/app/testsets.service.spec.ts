import { TestBed, inject } from '@angular/core/testing';

import { TestsetsService } from './testsets.service';

describe('TestsetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestsetsService]
    });
  });

  it('should be created', inject([TestsetsService], (service: TestsetsService) => {
    expect(service).toBeTruthy();
  }));
});
