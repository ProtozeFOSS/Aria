import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaHeaderComponent } from './olga-header.component';

describe('OlgaHeaderComponent', () => {
  let component: OlgaHeaderComponent;
  let fixture: ComponentFixture<OlgaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlgaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
