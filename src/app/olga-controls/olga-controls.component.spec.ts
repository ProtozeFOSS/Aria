import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaControlsComponent } from './olga-controls.component';

describe('OlgaControlsComponent', () => {
  let component: OlgaControlsComponent;
  let fixture: ComponentFixture<OlgaControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlgaControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
