import { TestBed, inject } from '@angular/core/testing';

import { DataService } from '../../node_modules/mysql2/node_modules/iconv-lite/data.service';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
