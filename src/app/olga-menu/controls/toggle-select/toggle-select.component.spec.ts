import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSelectComponent } from './toggle-select.component';

describe('ToggleSelectComponent', () => {
  let component: ToggleSelectComponent;
  let fixture: ComponentFixture<ToggleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
