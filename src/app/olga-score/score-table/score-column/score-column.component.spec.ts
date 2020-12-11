import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreColumnComponent } from './score-column.component';

describe('ScoreColumnComponent', () => {
  let component: ScoreColumnComponent;
  let fixture: ComponentFixture<ScoreColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
