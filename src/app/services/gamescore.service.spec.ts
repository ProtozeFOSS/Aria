import { TestBed } from '@angular/core/testing';

import { Gamescore.ServiceService } from './gamescore.service.service';

describe('Gamescore.ServiceService', () => {
  let service: Gamescore.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gamescore.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
