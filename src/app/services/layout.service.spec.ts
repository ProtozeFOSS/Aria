import { TestBed } from '@angular/core/testing';

import { Layout.ServiceService } from './layout.service.service';

describe('Layout.ServiceService', () => {
  let service: Layout.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Layout.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
