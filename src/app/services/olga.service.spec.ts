import { TestBed } from '@angular/core/testing';

import { OlgaService } from './olga.service';

describe('OlgaService', () => {
  let service: OlgaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlgaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
