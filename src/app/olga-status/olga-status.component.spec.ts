import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaStatusComponent } from './olga-status.component';

describe('OlgaStatusComponent', () => {
  let component: OlgaStatusComponent;
  let fixture: ComponentFixture<OlgaStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlgaStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
