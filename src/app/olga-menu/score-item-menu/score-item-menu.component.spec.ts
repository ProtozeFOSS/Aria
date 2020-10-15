import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGameScoreItemComponent } from './menu-game-score-item.component';

describe('MenuGameScoreItemComponent', () => {
  let component: MenuGameScoreItemComponent;
  let fixture: ComponentFixture<MenuGameScoreItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuGameScoreItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGameScoreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
