import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnMenuComponent } from './pgn-menu.component';

describe('PgnMenuComponent', () => {
  let component: PgnMenuComponent;
  let fixture: ComponentFixture<PgnMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgnMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgnMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
