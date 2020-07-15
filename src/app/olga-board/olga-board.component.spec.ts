import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaBoardComponent } from './olga-board.component';

describe('OlgaBoardComponent', () => {
  let component: OlgaBoardComponent;
  let fixture: ComponentFixture<OlgaBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlgaBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
