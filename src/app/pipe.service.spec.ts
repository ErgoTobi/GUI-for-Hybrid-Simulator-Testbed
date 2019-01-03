import { TestBed, inject } from '@angular/core/testing';

import { PipeService } from './pipe.service';

describe('PipeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PipeService]
    });
  });

  it('should be created', inject([PipeService], (service: PipeService) => {
    expect(service).toBeTruthy();
  }));
});
