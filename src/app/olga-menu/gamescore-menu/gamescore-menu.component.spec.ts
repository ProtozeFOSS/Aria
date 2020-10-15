import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsGamescoreComponent } from './settings-gamescore.component';

describe('SettingsGamescoreComponent', () => {
  let component: SettingsGamescoreComponent;
  let fixture: ComponentFixture<SettingsGamescoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsGamescoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsGamescoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
