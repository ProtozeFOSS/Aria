import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlgaScoreTableComponent } from './olga-score-table.component';

describe('OlgaScoreTableComponent', () => {
  let component: OlgaScoreTableComponent;
  let fixture: ComponentFixture<OlgaScoreTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlgaScoreTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlgaScoreTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
