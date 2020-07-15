import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabeledSliderComponent } from './labeled-slider.component';

describe('LabeledSliderComponent', () => {
  let component: LabeledSliderComponent;
  let fixture: ComponentFixture<LabeledSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabeledSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabeledSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
