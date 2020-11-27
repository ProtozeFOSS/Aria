import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaScoreFlowComponent } from './olga-score-flow.component';

describe('OlgaScoreFlowComponent', () => {
  let component: OlgaScoreFlowComponent;
  let fixture: ComponentFixture<OlgaScoreFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlgaScoreFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaScoreFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
