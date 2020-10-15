import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaMenuComponent } from './olga-menu.component';

describe('OlgaMenuComponent', () => {
  let component: OlgaMenuComponent;
  let fixture: ComponentFixture<OlgaMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlgaMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
