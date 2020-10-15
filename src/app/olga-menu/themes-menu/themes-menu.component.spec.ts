import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemesMenuComponent } from './themes-menu.component';

describe('ThemesMenuComponent', () => {
  let component: ThemesMenuComponent;
  let fixture: ComponentFixture<ThemesMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemesMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
