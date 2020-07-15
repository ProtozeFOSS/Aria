import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayermoveComponent } from './playermove.component';

describe('PlayermoveComponent', () => {
  let component: PlayermoveComponent;
  let fixture: ComponentFixture<PlayermoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayermoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayermoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
