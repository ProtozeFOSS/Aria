import { TestBed } from '@angular/core/testing';

import { Keymap.ServiceService } from './keymap.service.service';

describe('Keymap.ServiceService', () => {
  let service: Keymap.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Keymap.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
