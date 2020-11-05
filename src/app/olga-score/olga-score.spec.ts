import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamescoreUx } from './gamescore.ux';

describe('GamescoreUx', () => {
  let component: GamescoreUx;
  let fixture: ComponentFixture<GamescoreUx>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamescoreUx ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamescoreUx);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
