import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutModeSelectComponent } from './layout-mode-select.component';

describe('LayoutModeSelectComponent', () => {
  let component: LayoutModeSelectComponent;
  let fixture: ComponentFixture<LayoutModeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutModeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutModeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
