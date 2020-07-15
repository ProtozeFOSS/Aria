import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaTestComponent } from './olga-test.component';

describe('OlgaTestComponent', () => {
  let component: OlgaTestComponent;
  let fixture: ComponentFixture<OlgaTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlgaTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
