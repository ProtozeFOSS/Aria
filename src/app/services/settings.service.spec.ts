import { TestBed } from '@angular/core/testing';

import { Settings.ServiceService } from './settings.service.service';

describe('Settings.ServiceService', () => {
  let service: Settings.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Settings.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
