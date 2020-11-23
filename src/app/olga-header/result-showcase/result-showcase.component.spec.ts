import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultShowcaseComponent } from './result-showcase.component';

describe('ResultShowcaseComponent', () => {
  let component: ResultShowcaseComponent;
  let fixture: ComponentFixture<ResultShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultShowcaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
