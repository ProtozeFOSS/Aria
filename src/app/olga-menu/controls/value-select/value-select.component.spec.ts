import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSelectComponent } from './value-select.component';

describe('ValueSelectComponent', () => {
  let component: ValueSelectComponent;
  let fixture: ComponentFixture<ValueSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
