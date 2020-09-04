import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaTitleComponent } from './olga-title.component';

describe('OlgaTitleComponent', () => {
  let component: OlgaTitleComponent;
  let fixture: ComponentFixture<OlgaTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlgaTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
