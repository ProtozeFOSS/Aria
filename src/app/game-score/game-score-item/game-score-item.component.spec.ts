import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamescoreItemComponent } from './gamescore-item.component';

describe('GamescoreItemComponent', () => {
  let component: GamescoreItemComponent;
  let fixture: ComponentFixture<GamescoreItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamescoreItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamescoreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
