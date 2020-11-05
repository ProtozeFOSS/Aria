import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerShowcaseComponent } from './player-showcase.component';

describe('PlayerShowcaseComponent', () => {
  let component: PlayerShowcaseComponent;
  let fixture: ComponentFixture<PlayerShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerShowcaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
